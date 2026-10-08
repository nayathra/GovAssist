import { useEffect, useState } from "react"
import { LanguageSwitcher, useLanguage } from "../i18n"
import type { Profile } from "./ProfilePage"

type Recommendation = {
  scheme_name: string
  slug: string
  details: string
  benefits: string
  eligibility: string
  level: string
  schemeCategory: string
  tags: string
  relevance_score: number
  matched_profile_signals: string[]
  eligibility_warnings: string[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

const RecommendationsPage = ({
  profile,
  onViewDetails,
  onExploreSchemes,
}: {
  profile: Profile
  onViewDetails: (slug: string) => void
  onExploreSchemes: () => void
}) => {
  const { t } = useLanguage()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        })
        if (!response.ok) throw new Error("Failed to generate recommendations")
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (err) {
        console.error("Failed to load recommendations:", err)
        setError("We couldn't generate recommendations right now. Please make sure the GovAssist backend is running.")
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [profile])

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102a43]">
      <div className="bg-[#073b6f] px-6 py-2 text-center text-xs text-white/85">
        Government Scheme Recommendation & AI Assistant
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#073b6f]">Gov<span className="text-[#0f8a5f]">Assist</span></div>
            <p className="text-xs font-medium text-slate-500">Potentially Relevant Scheme Discovery</p>
          </div>
          <button onClick={() => window.history.back()} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-[#073b6f] hover:bg-slate-50">{t("back")}</button>
        <LanguageSwitcher />
          </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">Your Results</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#073b6f] sm:text-4xl">Potentially Relevant Schemes</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">These schemes were surfaced using profile signals found in the available scheme data. They are not an official eligibility decision.</p>
        </div>

        <div className="mt-7 rounded-2xl border border-[#cfe0ef] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <span><strong>State:</strong> {profile.state || "Not provided"}</span>
            <span><strong>Occupation:</strong> {profile.occupation || "Not provided"}</span>
            {profile.studentStatus && <span><strong>Student:</strong> {profile.studentStatus}</span>}
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-4xl">⏳</div>
            <h2 className="mt-4 text-lg font-bold text-[#073b6f]">Finding potentially relevant schemes...</h2>
            <p className="mt-2 text-sm text-slate-500">Comparing your profile with information in the GovAssist dataset.</p>
          </div>
        )}

        {!loading && error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {!loading && !error && recommendations.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-[#073b6f]">No potentially relevant schemes were found</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Try exploring all schemes or updating your profile with more information.</p>
            <button onClick={onExploreSchemes} className="mt-6 rounded-xl bg-[#073b6f] px-5 py-3 text-sm font-bold text-white hover:bg-[#062f59]">Explore All Schemes →</button>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((scheme) => (
                <article key={scheme.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-[#eaf7f2] px-3 py-1 text-xs font-semibold text-[#07845b]">{scheme.schemeCategory || "General"}</span>
                    <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#073b6f]">{scheme.level || "Scheme"}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-bold leading-7 text-[#073b6f]">{scheme.scheme_name}</h2>
                  <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">{scheme.details || "Scheme details are available."}</p>
                  {scheme.matched_profile_signals.length > 0 && (
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Why it appeared</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {scheme.matched_profile_signals.map((signal) => (
                          <span key={signal} className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{signal}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {scheme.eligibility_warnings.length > 0 && (
                    <div className="mt-4 rounded-xl border border-[#ead7a0] bg-[#fff8df] p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#6b5410]">Eligibility to verify</p>
                      <ul className="mt-2 space-y-1 text-xs leading-5 text-[#705f28]">
                        {scheme.eligibility_warnings.map((warning) => (
                          <li key={warning}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button onClick={() => onViewDetails(scheme.slug)} className="mt-6 rounded-xl bg-[#073b6f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]">View Scheme Details →</button>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={onExploreSchemes} className="rounded-xl border border-[#073b6f] bg-white px-5 py-3 text-sm font-bold text-[#073b6f] hover:bg-[#f1f6fb]">Explore All Schemes</button>
            </div>
          </>
        )}

        <div className="mt-10 rounded-2xl border border-[#ead7a0] bg-[#fff8df] p-5">
          <p className="text-sm font-extrabold text-[#6b5410]">{t("important")}</p>
          <p className="mt-1 text-xs leading-5 text-[#705f28] sm:text-sm">GovAssist only surfaces potentially relevant schemes using the available dataset. It does not determine official eligibility. Always verify the complete requirements with the relevant government authority.</p>
        </div>
      </main>
    </div>
  )
}

export default RecommendationsPage
