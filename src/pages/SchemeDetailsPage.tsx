import { useEffect, useState } from "react"
import { LanguageSwitcher, useLanguage } from "../i18n"

type Scheme = {
  scheme_name: string
  slug: string
  details: string
  benefits: string
  eligibility: string
  application: string
  documents: string
  level: string
  schemeCategory: string
  tags: string
}

type SchemeDetailsPageProps = {
  schemeSlug: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"


const SchemeDetailsPage = ({
  schemeSlug,
}: SchemeDetailsPageProps) => {
  const [activeTab, setActiveTab] = useState("Overview")
  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { t } = useLanguage()

  const tabs = [
    { key: "Overview", label: t("overview") },
    { key: "Eligibility", label: t("eligibility") },
    { key: "Benefits", label: t("benefits") },
    { key: "Documents", label: t("documents") },
    { key: "How to Apply", label: t("howToApply") },
  ]

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_BASE_URL}/api/schemes/${encodeURIComponent(schemeSlug)}`
        )

        if (!response.ok) {
          throw new Error(t("schemeNotFound"))
        }

        const data = await response.json()

        setScheme(data.scheme)

        const viewedScheme = {
          scheme_name: data.scheme.scheme_name,
          slug: data.scheme.slug,
          level: data.scheme.level,
          schemeCategory: data.scheme.schemeCategory,
          viewedAt: new Date().toISOString(),
        }

        const existing = JSON.parse(
          localStorage.getItem("govassist_recent_schemes") || "[]",
        ) as typeof viewedScheme[]

        const updated = [
          viewedScheme,
          ...existing.filter((item) => item.slug !== viewedScheme.slug),
        ].slice(0, 5)

        localStorage.setItem(
          "govassist_recent_schemes",
          JSON.stringify(updated),
        )
      } catch (err) {
        console.error("Failed to load scheme:", err)
        setScheme(null)
        setError("Unable to load this scheme.")
      } finally {
        setLoading(false)
      }
    }

    fetchScheme()
  }, [schemeSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
        <div className="bg-[#071d35] px-6 py-2 text-center text-xs text-white/80">
          {t("brandTagline")}
        </div>

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="text-4xl">⏳</div>

            <h2 className="mt-4 text-xl font-bold text-[#073b6f]">
              {t("loading")}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {t("fetchingSchemes")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
        <div className="bg-[#071d35] px-6 py-2 text-center text-xs text-white/80">
          {t("brandTagline")}
        </div>

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">⚠️</div>

            <h2 className="mt-4 text-xl font-bold text-[#073b6f]">
              {t("schemeNotFound")}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We couldn't find this scheme in the available GovAssist
              dataset.
            </p>

            <button
              onClick={() => window.history.back()}
              className="mt-6 rounded-xl bg-[#073b6f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]"
            >
              {t("backToSchemes")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Top utility bar */}
      <div className="bg-[#071d35] px-6 py-2 text-center text-xs text-white/80">
        {t("brandTagline")}
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#073b6f] text-lg font-bold text-white">
              G
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#073b6f]">
                GovAssist
              </h1>

              <p className="text-xs text-slate-500">
                {t("brandTagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
                        <button
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </header>

      {/* Scheme Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf7f2] px-3 py-1 text-xs font-semibold text-[#07845b]">
                {scheme.schemeCategory || "General"}
              </span>

              <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#073b6f]">
                {scheme.level || "Government Scheme"}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#073b6f] md:text-4xl">
              {scheme.scheme_name}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Explore the available information about this scheme in a
              simple and structured format.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Details */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="overflow-x-auto border-b border-slate-200">
              <div className="flex min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-4 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "border-b-2 border-[#073b6f] text-[#073b6f]"
                        : "text-slate-500 hover:text-[#073b6f]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Overview */}
              {activeTab === "Overview" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    {t("schemeOverview")}
                  </h3>

                  <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                    {scheme.details || "No overview information is available."}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <InfoBox
                      label={t("schemeName")}
                      value={scheme.scheme_name}
                    />

                    <InfoBox
                      label={t("schemeCategory")}
                      value={scheme.schemeCategory || "Not specified"}
                    />

                    <InfoBox
                      label={t("schemeLevel")}
                      value={scheme.level || "Not specified"}
                    />

                    <InfoBox
                      label={t("source")}
                      value="GovAssist Scheme Dataset"
                    />
                  </div>

                  {scheme.tags && (
                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t("tags")}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {scheme.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Eligibility */}
              {activeTab === "Eligibility" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Eligibility
                  </h3>

                  <div className="mt-6 rounded-xl bg-[#f7f9fc] p-5">
                    <p className="text-sm font-semibold text-slate-700">
                      {t("eligibilityInfo")}
                    </p>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {scheme.eligibility ||
                        "No eligibility information is available in the dataset."}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-[#ead89a] bg-[#fff9df] p-5">
                    <p className="text-sm font-semibold text-slate-800">
                      Important
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This information is provided from the available scheme
                      dataset. It does not determine or guarantee official
                      eligibility. Please verify the requirements with the
                      relevant government authority.
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {activeTab === "Benefits" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    Benefits
                  </h3>

                  <div className="mt-6 rounded-xl bg-slate-50 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {scheme.benefits ||
                        "No benefits information is available in the dataset."}
                    </p>
                  </div>
                </div>
              )}

              {/* Documents */}
              {activeTab === "Documents" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    {t("requiredDocuments")}
                  </h3>

                  <div className="mt-6 rounded-xl bg-slate-50 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {scheme.documents ||
                        "No document information is available in the dataset."}
                    </p>
                  </div>
                </div>
              )}

              {/* How to Apply */}
              {activeTab === "How to Apply" && (
                <div>
                  <h3 className="text-xl font-bold text-[#073b6f]">
                    How to Apply
                  </h3>

                  <div className="mt-6 space-y-4">
                    {scheme.application ? (
                      <ApplicationSteps application={scheme.application} />
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-5">
                        <p className="text-sm leading-7 text-slate-600">{t("noInfo")}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 rounded-xl border border-[#cfe2d9] bg-[#eef9f4] p-4">
                    <p className="text-xs leading-5 text-slate-600">{t("languageNote")}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#073b6f]">
                {t("schemeSummary")}
              </h3>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label={t("scheme")}
                  value={scheme.scheme_name}
                />

                <SummaryRow
                  label={t("schemeCategory")}
                  value={scheme.schemeCategory || "Not specified"}
                />

                <SummaryRow
                  label={t("schemeLevel")}
                  value={scheme.level || "Not specified"}
                />

                <SummaryRow
                  label={t("status")}
                  value={t("informationAvailable")}
                />
              </div>

              <button
                onClick={() => setActiveTab("How to Apply")}
                className="mt-6 w-full rounded-xl bg-[#073b6f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]"
              >
                {t("applicationInfo")}
              </button>
            </div>

            {/* {t("importantInfo")} */}
            <div className="rounded-2xl border border-[#ead89a] bg-[#fff9df] p-6">
              <h3 className="font-bold text-slate-800">
                {t("importantInfo")}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                GovAssist helps users discover and understand scheme
                information. The information shown here does not guarantee
                eligibility and GovAssist is not an official government
                website.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Disclaimer */}
      <section className="border-t border-[#ead89a] bg-[#fff9df]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-xs leading-5 text-slate-700">
            <strong>Important:</strong> Information displayed on this page is
            retrieved from the GovAssist scheme dataset. Always verify
            eligibility, documents, benefits, and application requirements
            with the relevant official government authority.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#073b6f] px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="font-bold">GovAssist</p>

            <p className="mt-1 text-xs text-white/70">
              {t("brandTagline")}
            </p>
          </div>

          <p className="text-xs text-white/70">
            {t("academicFooter")}
          </p>
        </div>
      </footer>
    </div>
  )
}

const ApplicationSteps = ({ application }: { application: string }) => {
  const parts = application
    .split(/(?=Step\s*\d+\s*:)/i)
    .map((part) => part.trim())
    .filter(Boolean)

  const steps = parts.length
    ? parts.map((part, index) => {
        const match = part.match(/^Step\s*(\d+)\s*:\s*(.*)$/is)
        return {
          number: match ? Number(match[1]) : index + 1,
          text: (match ? match[2] : part).trim(),
        }
      })
    : [{ number: 1, text: application.trim() }]

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div
          key={`${step.number}-${step.text.slice(0, 30)}`}
          className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#073b6f] text-sm font-extrabold text-white">
            {step.number}
          </div>
          <div>
            <p className="text-sm font-bold text-[#073b6f]">Step {step.number}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* Reusable information box */
const InfoBox = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}

/* Reusable sidebar row */
const SummaryRow = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  )
}

export default SchemeDetailsPage