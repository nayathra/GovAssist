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

const API_BASE_URL = "http://127.0.0.1:8000"

const SchemesPage = ({
  onViewDetails,
}: {
  onViewDetails: (schemeSlug: string) => void
}) => {
  const { t } = useLanguage()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [level, setLevel] = useState("All Levels")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 12

  // Load real categories from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/schemes/filters`)

        if (!response.ok) {
          throw new Error("Failed to load filters")
        }

        const data = await response.json()

        setCategories(data.categories || [])
      } catch (error) {
        console.error("Failed to load filters:", error)
      }
    }

    fetchFilters()
  }, [])

  // Load schemes from backend
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (search.trim()) {
          params.set("search", search.trim())
        }

        if (category !== "All Categories") {
          params.set("category", category)
        }

        if (level !== "All Levels") {
          params.set("level", level)
        }

        const response = await fetch(
          `${API_BASE_URL}/api/schemes?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error("Failed to load schemes")
        }

        const data = await response.json()

        setSchemes(data.schemes || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("Failed to load schemes:", error)
        setSchemes([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [search, category, level, page])

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1)
  }, [search, category, level])

  const totalPages = Math.ceil(total / limit)

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

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </button>
        <LanguageSwitcher />
          </div>
      </header>

      {/* Page intro */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#07845b]">
              {t("exploreSchemes")}
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#073b6f] md:text-4xl">
              {t("exploreSchemesTitle")}
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Search and explore schemes by category and level using the
              GovAssist scheme database.
            </p>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_180px]">
            {/* Search */}
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔎
              </span>

              <input
                type="text"
                placeholder="{t("search")}"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#073b6f] focus:ring-2 focus:ring-[#073b6f]/10"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#073b6f]"
            >
              <option>{t("allCategories")}</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#073b6f]"
            >
              <option>{t("allLevels")}</option>
              <option>Central</option>
              <option>State</option>
            </select>
          </div>
        </div>
      </section>

      {/* Scheme cards */}
      <main className="mx-auto max-w-7xl px-6 pb-16">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="text-4xl">⏳</div>

            <h3 className="mt-4 text-lg font-bold text-[#073b6f]">
              {t("loadingSchemes")}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {t("fetchingSchemes")}
            </p>
          </div>
        ) : schemes.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {schemes.length} of {total.toLocaleString()} schemes
              </p>

              <p className="text-sm font-semibold text-[#073b6f]">
                Page {page} of {totalPages}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schemes.map((scheme) => (
                <article
                  key={scheme.slug}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-[#eaf7f2] px-3 py-1 text-xs font-semibold text-[#07845b]">
                      {scheme.schemeCategory || "General"}
                    </span>

                    <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#073b6f]">
                      {scheme.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-7 text-[#073b6f]">
                    {scheme.scheme_name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {scheme.details || "Scheme details are available."}
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {t("benefitsPreview")}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {scheme.benefits || "{t("benefitsAvailable")}"}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {scheme.tags
                      ?.split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 5)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* View Details */}
                  <button
                    onClick={() => onViewDetails(scheme.slug)}
                    className="mt-6 flex items-center justify-center rounded-xl bg-[#073b6f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]"
                  >
                    {t("viewDetails")}
                  </button>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("previous")}
                </button>

                <span className="rounded-xl bg-[#073b6f] px-4 py-2 text-sm font-bold text-white">
                  {page}
                </span>

                <button
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page === totalPages}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-4xl">🔎</div>

            <h3 className="mt-4 text-lg font-bold text-[#073b6f]">
              {t("noMatching")}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {t("tryFilters")}
            </p>
          </div>
        )}
      </main>

      {/* Disclaimer */}
      <section className="border-t border-[#ead89a] bg-[#fff9df]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-xs leading-5 text-slate-700">
            <strong>Important:</strong> GovAssist provides scheme information
            for educational and informational purposes. A scheme appearing in
            search results does not guarantee eligibility. Please verify
            eligibility and application requirements with the relevant
            government authority.
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

export default SchemesPage