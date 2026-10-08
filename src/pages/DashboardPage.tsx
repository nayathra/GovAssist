import { useEffect, useState } from "react"
import { LanguageSwitcher, useLanguage } from "../i18n"
import type { Profile } from "./ProfilePage"

type DashboardProps = {
  user: { id: number; name: string; email: string }
  profile: Profile | null
  onProfile: () => void
  onRecommendations: () => void
  onSchemes: () => void
  onAI: () => void
  onHome: () => void
  onLogout: () => void
  onViewScheme: (schemeSlug: string) => void
}

const DashboardPage = ({
  user,
  profile,
  onProfile,
  onRecommendations,
  onSchemes,
  onAI,
  onHome,
  onLogout,
  onViewScheme,
}: DashboardProps) => {
  const { t } = useLanguage()
  const profileComplete = Boolean(profile?.name && profile?.age && profile?.state && profile?.occupation)

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102a43]">
      <div className="bg-[#073b6f] px-6 py-2 text-center text-xs text-white">
        Government Scheme Recommendation & AI Assistant
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1250px] items-center justify-between px-5 py-4 sm:px-8">
          <button onClick={onHome} className="text-xl font-extrabold text-[#073b6f]">
            Gov<span className="text-[#0f8a5f]">Assist</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-[#102a43]">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        <LanguageSwitcher />
          </div>
      </header>

      <main className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 sm:py-10">
        <section className="rounded-3xl bg-[#073b6f] p-7 text-white shadow-lg sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#63d6a9]">
            Your Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Continue exploring government scheme information and discover
            schemes that may be relevant to your profile.
          </p>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0f8a5f]">
                  My Profile
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-[#102a43]">
                  {profileComplete ? "Profile ready" : "Complete your profile"}
                </h2>
              </div>
              <button
                onClick={onProfile}
                className="rounded-lg border border-[#b8cde0] px-3 py-2 text-xs font-bold text-[#073b6f] hover:bg-[#f2f7fb]"
              >
                {profileComplete ? "Edit Profile" : "Create Profile"}
              </button>
            </div>

            {profileComplete ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["State", profile?.state],
                  ["Occupation", profile?.occupation],
                  ["Age", profile?.age],
                  ["Student", profile?.studentStatus || "Not specified"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[#f7f9fc] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-bold text-[#102a43]">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Add your basic profile information so GovAssist can surface
                potentially relevant schemes.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#cfe2d9] bg-[#eef9f4] p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0f8a5f]">
              Profile status
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f8a5f] text-lg font-extrabold text-white">
                {profileComplete ? "✓" : "!"}
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#102a43]">
                  {profileComplete ? "Ready" : "Incomplete"}
                </p>
                <p className="text-xs text-slate-500">
                  {profileComplete ? "You can explore recommendations." : "Complete your profile first."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
              Quick Access
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#102a43]">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "My Recommendations",
                text: "View schemes that may match your profile.",
                icon: "01",
                action: onRecommendations,
                disabled: !profileComplete,
              },
              {
                title: "Explore Schemes",
                text: "Search and browse the complete scheme database.",
                icon: "02",
                action: onSchemes,
                disabled: false,
              },
              {
                title: "Ask GovAssist AI",
                text: "Ask questions about available scheme information.",
                icon: "03",
                action: onAI,
                disabled: false,
              },
              {
                title: "Update Profile",
                text: "Change your details whenever your circumstances change.",
                icon: "04",
                action: onProfile,
                disabled: false,
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={item.action}
                disabled={item.disabled}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#b8cde0] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3fb] text-sm font-extrabold text-[#073b6f]">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-base font-extrabold text-[#102a43]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.text}</p>
                <p className="mt-4 text-xs font-bold text-[#073b6f] group-hover:text-[#0f8a5f]">
                  Open →
                </p>
              </button>
            ))}
          </div>
        </section>

        <RecentlyViewed onViewScheme={onViewScheme} />

        <section className="mt-6 rounded-2xl border border-[#ead7a0] bg-[#fff8df] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#6b5410]">
            Important
          </p>
          <p className="mt-1 text-xs leading-5 text-[#705f28]">
            Recommendations shown by GovAssist are potentially relevant matches
            based on available scheme data. They do not determine or guarantee
            official eligibility.
          </p>
        </section>
      </main>

      <footer className="bg-[#073b6f] px-5 py-6 text-center text-xs text-blue-100">
        <p className="font-bold text-white">GovAssist</p>
        <p className="mt-1">Academic / student project • Not an official government website</p>
      </footer>
    </div>
  )
}

export default DashboardPage


type RecentScheme = {
  scheme_name: string
  slug: string
  level: string
  schemeCategory: string
  viewedAt: string
}

const RecentlyViewed = ({
  onViewScheme,
}: {
  onViewScheme: (schemeSlug: string) => void
}) => {
  const [items, setItems] = useState<RecentScheme[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("govassist_recent_schemes")
      setItems(saved ? JSON.parse(saved) : [])
    } catch {
      setItems([])
    }
  }, [])

  if (!items.length) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
          Recent Activity
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#102a43]">
          Recently Viewed Schemes
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Schemes you open will appear here so you can quickly return to them.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8a5f]">
          Recent Activity
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#102a43]">
          Recently Viewed Schemes
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.slug}
            onClick={() => onViewScheme(item.slug)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8cde0] hover:shadow-md"
          >
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#eaf7f2] px-2.5 py-1 text-[10px] font-bold text-[#07845b]">
                {item.schemeCategory || "General"}
              </span>
              <span className="rounded-full bg-[#eef4fb] px-2.5 py-1 text-[10px] font-bold text-[#073b6f]">
                {item.level || "Scheme"}
              </span>
            </div>

            <h3 className="mt-4 line-clamp-2 text-sm font-extrabold leading-5 text-[#102a43]">
              {item.scheme_name}
            </h3>

            <p className="mt-3 text-xs font-bold text-[#073b6f]">
              View Details →
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
