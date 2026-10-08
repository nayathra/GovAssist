import { useState } from "react"
import { LanguageSwitcher, useLanguage } from "../i18n"

const API_BASE_URL = "http://127.0.0.1:8000"

type AuthUser = {
  id: number
  name: string
  email: string
}

type AuthPageProps = {
  onSuccess: (user: AuthUser) => void
  onBack: () => void
}

const AuthPage = ({ onSuccess, onBack }: AuthPageProps) => {
  const { t } = useLanguage()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: mode === "register" ? name : "",
            email,
            password,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.")
      }

      localStorage.setItem("govassist_user", JSON.stringify(data.user))
      onSuccess(data.user)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102a43]">
      <div className="bg-[#073b6f] px-6 py-2 text-center text-xs text-white">
        {t("brandTagline")}
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="text-lg font-extrabold text-[#073b6f]"
          >
            Gov<span className="text-[#0f8a5f]">Assist</span>
          </button>

          <button
            onClick={onBack}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("back")}
          </button>
        <LanguageSwitcher />
          </div>
      </header>

      <main className="flex min-h-[calc(100vh-105px)] items-center justify-center px-5 py-12">
        <div className="grid w-full max-w-[900px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_1.1fr]">
          <div className="hidden bg-[#073b6f] p-10 text-white lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63d6a9]">
              {t("welcomeToGovAssist")}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">
              {t("discoverEasier")}
            </h1>
            <p className="mt-5 text-sm leading-6 text-blue-100">
              {t("createAccountDesc")}
            </p>

            <div className="mt-10 space-y-4 text-sm text-blue-100">
              <p>✓ {t("saveProfile")}</p>
              <p>✓ {t("explorePotential")}</p>
              <p>✓ {t("useAssistant")}</p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => {
                  setMode("login")
                  setError("")
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold ${
                  mode === "login"
                    ? "bg-white text-[#073b6f] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMode("register")
                  setError("")
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold ${
                  mode === "register"
                    ? "bg-white text-[#073b6f] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0f8a5f]">
                {mode === "login" ? t("welcomeBack") : t("getStarted")}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#073b6f]">
                {mode === "login" ? t("signInGovAssist") : t("createYourAccount")}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {mode === "login"
                  ? t("continueExploring")
                  : t("accountContinue")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {mode === "register" && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    {t("fullName")}
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#073b6f] focus:ring-2 focus:ring-[#073b6f]/10"
                    placeholder={t("enterName")}
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  {t("email")}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#073b6f] focus:ring-2 focus:ring-[#073b6f]/10"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  {t("password")}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#073b6f] focus:ring-2 focus:ring-[#073b6f]/10"
                  placeholder={t("minPassword")}
                />
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#073b6f] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#062f59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t("pleaseWait")
                  : mode === "login"
                    ? t("loginGovAssist")
                    : t("createAccount")}
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
              {t("authNote")}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage
