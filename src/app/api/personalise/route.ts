import { NextRequest, NextResponse } from 'next/server'

// ─── Minimum description length to bother calling Claude ─────────────────────
const MIN_DESCRIPTION_LENGTH = 30

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ text: null }, { status: 503 })
  }

  try {
    const { userPlace, userDescription, neighbourhoodName, neighbourhoodDescription } =
      await req.json() as {
        userPlace:                  string
        userDescription:            string
        neighbourhoodName:          string
        neighbourhoodDescription:   string
      }

    // Not enough to work with — caller will use static fallback
    if (!userDescription || userDescription.trim().length < MIN_DESCRIPTION_LENGTH) {
      return NextResponse.json({ text: null })
    }

    console.log('[Anthropic] Calling Claude API — model: claude-sonnet-4-6, description length:', userDescription.trim().length)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':          apiKey,
        'anthropic-version':  '2023-06-01',
        'content-type':       'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5',
        max_tokens: 220,
        system: `You write for Apt, a Vancouver neighbourhood matching tool. Your voice is warm, observational, and specific — like a knowledgeable friend who knows both cities well, not a travel brochure. Short sentences. No hype. No superlatives. Write in the present tense.`,
        messages: [{
          role:    'user',
          content: `A user described loving ${userPlace || 'a place they love'}. Here is what they wrote:

"${userDescription}"

The neighbourhood we matched them with is ${neighbourhoodName}:

"${neighbourhoodDescription}"

Write 2–3 sentences connecting what they loved about their place to what they will find in ${neighbourhoodName}. Aim for 3 sentences but never cut a thought short to hit a number. Be specific to both places. Reference the user's own words where it feels natural. Do not begin with "Just like" or "Similar to". Do not use superlatives. Do not mention the tool or the matching process.`,
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error ${response.status}: ${err}`)
    }

    const data = await response.json() as { content: Array<{ text: string }> }
    const text = data.content[0]?.text?.trim() ?? null
    console.log('[Anthropic] Response received — text length:', text?.length ?? 0)

    return NextResponse.json({ text })

  } catch (err) {
    console.error('Personalise error:', err)
    // Always return gracefully — caller falls back to static text
    return NextResponse.json({ text: null })
  }
}
