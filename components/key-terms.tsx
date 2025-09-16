"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, ArrowLeft, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LegalTerm {
  term: string
  explanation: string
}

interface AnalysisData {
  legalTerms: LegalTerm[]
}

export function KeyTerms() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <Button variant="ghost" asChild className="w-fit mb-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <CardTitle className="text-3xl font-bold">Key Terms Explained</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.legalTerms.map((term, index) => (
              <Card key={index} className="bg-gray-50 border">
                <CardContent className="p-4">
                  <p className="font-semibold text-lg text-gray-900">{term.term}</p>
                  <p className="text-gray-700 mt-1">{term.explanation}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
