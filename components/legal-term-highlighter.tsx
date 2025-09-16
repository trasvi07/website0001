"use client"

interface LegalTerm {
  term: string
  explanation: string
}

interface LegalTermHighlighterProps {
  text: string
  legalTerms: LegalTerm[]
}

export function LegalTermHighlighter({ text, legalTerms }: LegalTermHighlighterProps) {
  const handleTermClick = (term: string) => {
    const termData = legalTerms.find((t) => t.term === term)
    if (termData) {
      // Trigger chatbot with this term
      const event = new CustomEvent("openChatWithTerm", { detail: term })
      window.dispatchEvent(event)
    }
  }

  const highlightedText = text.replace(/<<(.+?)>>/g, (match, term) => {
    return `<span class="legal-term cursor-pointer bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium hover:bg-blue-200 transition-colors" data-term="${term}">${term}</span>`
  })

  return (
    <div
      dangerouslySetInnerHTML={{ __html: highlightedText }}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("legal-term")) {
          const term = target.getAttribute("data-term")
          if (term) handleTermClick(term)
        }
      }}
    />
  )
}
