import { useState } from "react"
import { LanguageSwitcher, useLanguage } from "../i18n"

const API_BASE_URL = "http://127.0.0.1:8000"

type Message = {
  id: number
  type: "ai" | "user"
  text: string
}

const suggestedQuestions = [
  "What schemes may be relevant for students?",
  "What information do I need to check scheme eligibility?",
  "How can I find education-related schemes?",
  "What documents are usually mentioned in scheme information?",
]

const AIAssistantPage = () => {
  const { t } = useLanguage()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      text: "Hello! I'm GovAssist AI. I can help you understand government scheme information available in the GovAssist database. What would you like to know?",
    },
    {
      id: 2,
      type: "user",
      text: "What schemes may be relevant for students?",
    },
    {
      id: 3,
      type: "ai",
      text: "GovAssist can help identify schemes that may be relevant to students based on information available in the scheme database. You can provide details such as your state, education level, student status, and other profile information to explore potentially relevant schemes.",
    },
    {
      id: 4,
      type: "user",
      text: "What information should I check before applying for a scheme?",
    },
    {
      id: 5,
      type: "ai",
      text: "You should review the scheme's eligibility information, benefits, required documents, application process, and the relevant authority or official source. GovAssist will present this information from the available scheme data.",
    },
    {
      id: 6,
      type: "user",
      text: "Can you tell me if I am eligible?",
    },
    {
      id: 7,
      type: "ai",
      text: "I can help you understand the eligibility information available for a scheme, but GovAssist does not guarantee official eligibility. Final eligibility should be verified using the relevant official scheme information.",
    },
  ])

  const handle{t("send")} = async (messageText?: string) => {
    const text = (messageText ?? input).trim()

    if (!text) return

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text,
    }

    setMessages((previous) => [...previous, userMessage])
    setInput("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      })

      if (!response.ok) {
        throw new Error("Assistant request failed")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        text: data.answer,
      }

      setMessages((previous) => [...previous, aiMessage])
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          type: "ai",
          text: "I couldn't connect to the GovAssist backend right now. Please make sure the backend server is running and try again.",
        },
      ])
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "ai",
        text: "Hello! I'm GovAssist AI. I can help you understand government scheme information available in the GovAssist database. What would you like to know?",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Top utility bar */}
      <div className="bg-[#071d35] px-4 py-1.5 text-center text-[11px] text-white/80">
        {t("brandTagline")}
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#073b6f] text-base font-bold text-white">
              G
            </div>

            <div>
              <h1 className="text-base font-bold text-[#073b6f]">
                GovAssist
              </h1>
              <p className="text-[11px] text-slate-500">
                {t("brandTagline")}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t("back")}
          </button>
        <LanguageSwitcher />
          </div>
      </header>

      {/* Main content */}
      <main className="w-full px-5 py-5 lg:px-8">
        {/* Intro */}
        <section className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#073b6f] text-lg">
              🤖
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#07845b]">
                {t("aiAssistant")}
              </p>
              <h2 className="text-2xl font-extrabold text-[#073b6f] md:text-3xl">
                {t("aiAssistant")}
              </h2>
            </div>
          </div>

          <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-600">
            Ask questions about government schemes and use the assistant to
            understand information available in the GovAssist scheme database.
          </p>
        </section>

        {/* Chat container */}
        <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7f2] text-sm">
                🤖
              </div>

              <div>
                <p className="text-sm font-bold text-[#073b6f]">
                  GovAssist AI
                </p>
                <p className="text-[11px] text-[#07845b]">
                  {t("aiAnswers")}
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              {t("clearChat")}
            </button>
          </div>

          {/* Compact conversation area */}
          <div className="min-h-0 max-h-[360px] w-full space-y-3 overflow-y-auto bg-[#f8fafc] p-4 md:p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[90%] items-start gap-2 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      message.type === "user"
                        ? "bg-[#073b6f] text-white"
                        : "bg-[#eaf7f2]"
                    }`}
                  >
                    {message.type === "user" ? "You" : "🤖"}
                  </div>

                  <div
                    className={`rounded-2xl px-3 py-2 text-xs leading-5 ${
                      message.type === "user"
                        ? "rounded-tr-sm bg-[#073b6f] text-white"
                        : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested questions */}
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {t("suggestedQuestions")}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handle{t("send")}(question)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-[#073b6f] hover:bg-[#eef4fb] hover:text-[#073b6f]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handle{t("send")}()
                  }
                }}
                rows={1}
                placeholder="{t("askSchemesPlaceholder")}"
                className="min-h-[42px] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-xs outline-none transition focus:border-[#073b6f] focus:ring-2 focus:ring-[#073b6f]/10"
              />

              <button
                onClick={() => handle{t("send")}()}
                className="rounded-xl bg-[#073b6f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#062f59]"
              >
                {t("send")}
              </button>
            </div>

            <p className="mt-1.5 text-[10px] text-slate-400">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-4 rounded-xl border border-[#ead89a] bg-[#fff9df] px-4 py-2.5">
          <p className="text-center text-[10px] leading-4 text-slate-700">
            <strong>Important:</strong> GovAssist AI is designed to explain
            information available in the scheme database. It does not
            guarantee eligibility. In the backend stage, responses will be
            generated using retrieved scheme information rather than invented
            facts.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#073b6f] px-5 py-4 text-white">
        <div className="mx-auto flex w-full flex-col gap-1 text-center md:flex-row md:items-center md:justify-between md:text-left lg:px-3">
          <div>
            <p className="text-sm font-bold">GovAssist</p>
            <p className="text-[10px] text-white/70">
              {t("brandTagline")}
            </p>
          </div>

          <p className="text-[10px] text-white/70">
            Student project • Not an official government website
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AIAssistantPage
