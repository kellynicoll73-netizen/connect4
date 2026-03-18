import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import neighbourhoodsData from '@/data/neighbourhoods.json'

// Build description map dynamically from the neighbourhood dataset
const NEIGHBOURHOOD_DESCRIPTIONS: Record<string, string> = Object.fromEntries(
  (neighbourhoodsData as Array<{ id: string; personalityDescription: string }>).map(
    ({ id, personalityDescription }) => [id, personalityDescription]
  )
)

async function getEmbedding(client: OpenAI, text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    return NextResponse.json({ error: 'No API key configured' }, { status: 503 })
  }

  try {
    const { text } = await req.json() as { text: string }
    if (!text?.trim()) {
      return NextResponse.json({ semanticScores: {} })
    }

    const client = new OpenAI({ apiKey })

    // Embed the user's description
    const userEmbedding = await getEmbedding(client, text)

    // Embed all neighbourhood descriptions in parallel
    const entries = Object.entries(NEIGHBOURHOOD_DESCRIPTIONS)
    const neighbourhoodEmbeddings = await Promise.all(
      entries.map(([, desc]) => getEmbedding(client, desc))
    )

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
