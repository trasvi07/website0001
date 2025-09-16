"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LegalTerm {
  term: string
  explanation: string
}

interface ChatBotProps {
  legalTerms: LegalTerm[]
}

interface Message {
  text: string
  sender: "user" | "bot"
}

export function ChatBot({ legalTerms }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I can help explain legal terms and answer questions about your analyzed document.",
      sender: "bot",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleOpenChatWithTerm = (event: CustomEvent) => {
      const term = event.detail
      setIsOpen(true)
      setInputValue(`What does "${term}" mean?`)
      setTimeout(() => handleSubmit(new Event("submit") as any, `What does "${term}" mean?`), 100)
    }

    window.addEventListener("openChatWithTerm", handleOpenChatWithTerm as EventListener)
    return () => window.removeEventListener("openChatWithTerm", handleOpenChatWithTerm as EventListener)
  }, [legalTerms])

  const handleSubmit = async (e: React.FormEvent, customMessage?: string) => {
    e.preventDefault()
    const message = customMessage || inputValue.trim()
    if (!message) return

    setMessages((prev) => [...prev, { text: message, sender: "user" }])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: legalTerms.map((term) => `${term.term}: ${term.explanation}`).join("\n"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }])
    } catch (error) {
      // Fallback to local term matching if API fails
      let botResponse =
        "I can help explain legal terms from your analyzed document. Please ask about specific terms or concepts."

      const requestedTerm = legalTerms.find((term) => message.toLowerCase().includes(term.term.toLowerCase()))

      if (requestedTerm) {
        botResponse = requestedTerm.explanation
      }

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">AI Legal Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-blue-100 text-blue-900 ml-auto rounded-br-sm"
                      : "bg-gray-100 text-gray-900 mr-auto rounded-bl-sm"
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {isTyping && (
                <div className="bg-gray-100 text-gray-900 max-w-[80%] p-3 rounded-lg rounded-bl-sm text-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex items-center space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a legal term..."
                className="flex-1"
              />
              <Button type="submit" size="icon" className="shrink-0" disabled={isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
