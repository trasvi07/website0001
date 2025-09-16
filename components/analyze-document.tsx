"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AnalyzeDocument() {
  const [documentText, setDocumentText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".txt")) {
      setError("Only .txt files are supported at this time.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setDocumentText(e.target?.result as string)
    }
    reader.readAsText(file)
  }

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError("Please provide a document to analyze.")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const analysisData = await response.json()

      // Store analysis data in sessionStorage for the dashboard
      sessionStorage.setItem("analysisData", JSON.stringify(analysisData))
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Analyze Your Document</CardTitle>
            <CardDescription>Upload or paste your document to begin analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card className="bg-blue-600 text-white border-0">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-3xl font-bold">Start Your Analysis</h2>
                <p className="text-blue-100 max-w-md mx-auto">
                  Upload your contract, agreement, or terms of service. Our AI will provide a simple summary and risk
                  analysis in moments.
                </p>
                <div>
                  <input type="file" id="file-upload" className="hidden" accept=".txt" onChange={handleFileUpload} />
                  <Button asChild variant="secondary" size="lg" className="text-blue-600">
                    <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="document-text">Document Text (or Paste Here)</Label>
              <Textarea
                id="document-text"
                className="min-h-48"
                placeholder="Your uploaded file content will appear here, or you can paste your text directly."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
              />
            </div>

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !documentText.trim()} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                "Analyze Document"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
