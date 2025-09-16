"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, Shield, BookOpen, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LegalTermHighlighter } from "@/components/legal-term-highlighter"
import { ChatBot } from "@/components/chat-bot"

interface AnalysisData {
  summary: string
  legalTerms: Array<{ term: string; explanation: string }>
  riskAnalysis: {
    verdict: string
    flags: Array<{ type: string; description: string }>
  }
  recommendations: string[]
  comprehensionCheck: Array<{
    question: string
    options: string[]
    correctAnswer: string
  }>
}

export function Dashboard() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedData = sessionStorage.getItem("analysisData")
    if (storedData) {
      setAnalysisData(JSON.parse(storedData))
    } else {
      router.push("/analyze")
    }
  }, [router])

  if (!analysisData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <FileText className="w-7 h-7 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Legal AI</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Plain Language Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <LegalTermHighlighter text={analysisData.summary} legalTerms={analysisData.legalTerms} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/risk-analysis">
            <Card className="shadow-lg border-0 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <CardTitle className="text-xl">Risk Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900">{analysisData.riskAnalysis.verdict}</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">View details →</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/key-terms">
            <Card className="shadow-lg border-0 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-xl">Key Terms Explained</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{analysisData.legalTerms.length} terms identified.</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">View glossary →</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/comprehension-check">
            <Card className="shadow-lg border-0 cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-xl">Understanding Check</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Test your knowledge.</p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">Start quiz →</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Actionable Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {analysisData.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <ChatBot legalTerms={analysisData.legalTerms} />
    </div>
  )
}
