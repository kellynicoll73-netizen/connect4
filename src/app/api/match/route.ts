import { NextRequest, NextResponse } from 'next/server'
import neighbourhoodsData from '@/data/neighbourhoods.json'

// Build description map dynamically from the neighbourhood dataset
const NEIGHBOURHOOD_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  (neighbourhoodsData as Array<{ id: string; personalityDescription: string }>).map(
    ({ id, personalityDescription }) => [id, personalityDescription]
  )
)

// ─── Voyage AI embeddings ─────────────────────────────────────────────────────
// Voyage accepts a batch of inputs in one call — more efficient than one-at-a-time.
// Model: voyage-3 (flagship general-purpose model, best quality)

async function getEmbeddings(apiKey: string, inputs: string[]): Promise<number[][]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-3',
      input: inputs,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Voyage AI error ${response.status}: ${error}`)
  }

  const data = await response.json() as { data: Array<{ embedding: number[] }> }
  return data.data.map(d => d.embedding)
}

// ─── Cosine similarity ────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 503 })
  }

  try {
    const { text } = await req.json() as { text: string }
    if (!text?.trim()) {
      return NextResponse.json({ semanticScores: {} })
    }

    const entries = Object.entries(NEIGHBOURHOOD_DESCRIPTIONS)

    // Single batch call: user text first, then all neighbourhood descriptions
    const allTexts = [text, ...entries.map(([, desc]) => desc)]
    console.log('[Voyage] Calling embeddings API — input count:', allTexts.length)
    const allEmbeddings = await getEmbeddings(apiKey, allTexts)
    console.log('[Voyage] Embeddings received — dimension:', allEmbeddings[0]?.length)

    const userEmbedding = allEmbeddings[0]
    const neighbourhoodEmbeddings = allEmbeddings.slice(1)

    // Compute cosine similarity for each neighbourhood
    const semanticScores: Record<string, number> = {}
    entries.forEach(([id], i) => {
      const sim = cosineSimilarity(userEmbedding, neighbourhoodEmbeddings[i])
      // Convert from [-1,1] to [0,100]
      semanticScores[id] = Math.round(((sim + 1) / 2) * 100)
    })

    return NextResponse.json({ semanticScores })
  } catch (err) {
    console.error('Semantic match error:', err)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
