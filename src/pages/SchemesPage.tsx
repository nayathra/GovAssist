import { useMemo, useState } from "react"

type Scheme = {
  id: number
  name: string
  category: string
  level: "Central" | "State"
  description: string
  benefits: string
  tags: string[]
}

const demoSchemes: Scheme[] = [
  {
    id: 1,
    name: "Education Support Scheme (Demo)",
    category: "Education",
    level: "Central",
    description:
      "A sample scheme preview designed to demonstrate how education-related government support could be displayed.",
    benefits: "Education assistance, student support",
    tags: ["Students", "Education"],
  },
  {
    id: 2,
    name: "Agriculture Assistance Scheme (Demo)",
    category: "Agriculture",
    level: "State",
    description:
      "A sample scheme preview for demonstrating agriculture-related assistance and support.",
    benefits: "Agricultural support, farmer assistance",
    tags: ["Farmers", "Agriculture"],
  },
  {
    id: 3,
    name: "Employment & Skill Development Scheme (Demo)",
    category: "Employment",
    level: "Central",
    description:
      "A sample scheme preview showing how employment and skill-development opportunities can be presented.",
    benefits: "Skill development, employment support",
    tags: ["Employment", "Skills"],
  },
  {
    id: 4,
    name: "Health Support Scheme (Demo)",
    category: "Health",
    level: "Central",
    description:
      "A sample scheme preview for demonstrating health-related government support information.",
    benefits: "Healthcare support, medical assistance",
    tags: ["Health", "Healthcare"],
  },
  {
    id: 5,
    name: "Housing Assistance Scheme (Demo)",
    category: "Housing",
    level: "State",
    description:
      "A sample scheme preview for demonstrating housing and household assistance.",
    benefits: "Housing support, household assistance",
    tags: ["Housing", "Households"],
  },
  {
    id: 6,
    name: "Women & Child Support Scheme (Demo)",
    category: "Women & Child",
    level: "State",
    description:
      "A sample scheme preview for demonstrating women and child welfare information.",
    benefits: "Family support, welfare assistance",
    tags: ["Women", "Children"],
  },
]

const categories = [
  "All Categories",
  "Education",
  "Agriculture",
  "Employment",
  "Health",
  "Housing",
  "Women & Child",
]

const levels = ["All Levels", "Central", "State"]

const SchemesPage = ({
  onViewDetails,
}: {
  onViewDetails: (schemeName: string) => void
}) => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [level, setLevel] = useState("All Levels")

  const filteredSchemes = useMemo(() => {
    return demoSchemes.filter((scheme) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        scheme.name.toLowerCase().includes(searchText) ||
        scheme.description.toLowerCase().includes(searchText) ||
        scheme.tags.some((tag) => tag.toLowerCase().includes(searchText))

      const matchesCategory =
        category === "All Categories" || scheme.category === category

      const matchesLevel =
        level === "All Levels" || scheme.level === level

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [search, category, level])

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Top utility bar */}
      <div className="bg-[#071d35] px-6 py-2 text-center text-xs text-white/80">
        Government Scheme Recommendation & AI Assistant
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
                Government Scheme Recommendation & AI Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Page intro */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#07845b]">
              Explore Schemes
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#073b6f] md:text-4xl">
              Explore Government Schemes
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Search and explore schemes by category and level. Detailed
              eligibility information will be connected to the GovAssist
              database in the next stage.
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
                placeholder="Search schemes..."
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
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            {/* Level */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#073b6f]"
            >
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Scheme cards */}
      <main className="mx-auto max-w-7xl px-6 pb-16">
        {filteredSchemes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <article
                key={scheme.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="rounded-full bg-[#eaf7f2] px-3 py-1 text-xs font-semibold text-[#07845b]">
                    {scheme.category}
                  </span>

                  <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#073b6f]">
                    {scheme.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-7 text-[#073b6f]">
                  {scheme.name}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {scheme.description}
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Benefits Preview
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {scheme.benefits}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {scheme.tags.map((tag) => (
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
                  onClick={() => onViewDetails(scheme.name)}
                  className="mt-6 flex items-center justify-center rounded-xl bg-[#073b6f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]"
                >
                  View Details →
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-4xl">🔎</div>

            <h3 className="mt-4 text-lg font-bold text-[#073b6f]">
              No matching schemes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* Demo disclaimer */}
      <section className="border-t border-[#ead89a] bg-[#fff9df]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-xs leading-5 text-slate-700">
            <strong>Demo notice:</strong> The scheme information shown on this
            page is sample frontend data for the GovAssist project. It is not
            official government scheme information and should not be used to
            determine eligibility.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#073b6f] px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="font-bold">GovAssist</p>

            <p className="mt-1 text-xs text-white/70">
              Government Scheme Recommendation & AI Assistant
            </p>
          </div>

          <p className="text-xs text-white/70">
            Student project • Not an official government website
          </p>
        </div>
      </footer>
    </div>
  )
}

export default SchemesPage