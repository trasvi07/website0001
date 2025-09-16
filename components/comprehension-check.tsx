"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, ArrowLeft, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
}

interface AnalysisData {
  comprehensionCheck: QuizQuestion[]
}

export function ComprehensionCheck() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const storedData = sessionStorage.getItem("analysisData")
    if (storedData) {
      setAnalysisData(JSON.parse(storedData))
    } else {
      router.push("/analyze")
    }
  }, [router])

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }))
  }

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
              <Brain className="w-8 h-8 text-green-500" />
              <CardTitle className="text-3xl font-bold">Check Your Understanding</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysisData.comprehensionCheck.map((item, index) => (
              <Card key={index} className="bg-gray-50 border">
                <CardContent className="p-6">
                  <p className="font-semibold mb-4 text-lg">
                    Q{index + 1}: {item.question}
                  </p>
                  <div className="space-y-2">
                    {item.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[index] === option
                      const isCorrect = option === item.correctAnswer
                      const showResult = selectedAnswers[index] !== undefined

                      let buttonClass = "w-full text-left p-3 rounded-md border transition-colors "

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass += "bg-green-100 border-green-500 text-green-800 font-semibold"
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "bg-red-100 border-red-500 text-red-800"
                        } else {
                          buttonClass += "border-gray-300 text-gray-600"
                        }
                      } else {
                        buttonClass += "border-gray-300 hover:bg-gray-100"
                      }

                      return (
                        <Button
                          key={optionIndex}
                          variant="ghost"
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(index, option)}
                          disabled={showResult}
                        >
                          {option}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
