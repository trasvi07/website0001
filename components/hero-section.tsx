import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight text-balance">
          Demystify Legal Documents in Seconds.
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
          Stop guessing, start understanding. Legal AI uses artificial intelligence to translate complex contracts and
          agreements into simple, actionable insights.
        </p>
        <Button asChild size="lg" className="mt-10 text-lg px-8 py-4">
          <Link href="/analyze">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
