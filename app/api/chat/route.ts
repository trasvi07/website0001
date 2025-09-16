import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key not configured. Please add GEMINI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const systemPrompt = `You are "Legal AI," a helpful legal assistant. Answer questions about legal terms and documents in simple, clear language. If provided with document context, use it to give more specific answers.`

    const payload = {
      contents: [
        {
          parts: [
            {
              text: context ? `Context: ${context}\n\nQuestion: ${message}` : `Question: ${message}`,
            },
          ],
        },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(`API Error (${response.status}): ${errorBody.error?.message || "Unknown error"}`)
    }

    const result = await response.json()
    const candidate = result.candidates?.[0]

    if (candidate && candidate.content?.parts?.[0]?.text) {
      return NextResponse.json({ response: candidate.content.parts[0].text })
    } else {
      throw new Error("The AI returned an empty or invalid response.")
    }
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Chat failed" }, { status: 500 })
  }
}
