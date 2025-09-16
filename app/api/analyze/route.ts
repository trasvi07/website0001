import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { documentText } = await request.json()

    if (!documentText) {
      return NextResponse.json({ error: "Document text is required" }, { status: 400 })
    }

    console.log("[v0] Checking for GEMINI_API_KEY...")
    console.log(
      "[v0] Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("GEMINI")),
    )

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.log("[v0] GEMINI_API_KEY not found in environment variables")
      return NextResponse.json(
        {
          error: "API key not configured. Please add GEMINI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] GEMINI_API_KEY found, proceeding with analysis...")

    const systemPrompt = `You are "Legal AI," an expert legal analyst. Your task is to demystify a legal document for a non-technical user. Return a structured JSON object. The summary should be written in simple, clear language. Mark legal terms for highlighting by wrapping them in double angle brackets, like <<Term>>.`

    const payload = {
      contents: [{ parts: [{ text: `Document:\n\n${documentText}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            legalTerms: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  term: { type: "STRING" },
                  explanation: { type: "STRING" },
                },
              },
            },
            riskAnalysis: {
              type: "OBJECT",
              properties: {
                verdict: { type: "STRING" },
                flags: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      type: { type: "STRING" },
                      description: { type: "STRING" },
                    },
                  },
                },
              },
            },
            recommendations: { type: "ARRAY", items: { type: "STRING" } },
            comprehensionCheck: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: { type: "ARRAY", items: { type: "STRING" } },
                  correctAnswer: { type: "STRING" },
                },
              },
            },
          },
        },
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
      const analysisData = JSON.parse(candidate.content.parts[0].text)
      return NextResponse.json(analysisData)
    } else {
      throw new Error("The AI returned an empty or invalid response.")
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 500 })
  }
}
