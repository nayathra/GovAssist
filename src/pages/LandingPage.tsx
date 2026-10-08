import { useState } from "react"
import heroBackground from "../assets/govassist-hero-bg.png"

const emblemUrl =
  "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"

const parliamentUrl =
  "https://upload.wikimedia.org/wikipedia/commons/c/ca/Glimpses_of_the_new_Parliament_Building%2C_in_New_Delhi_%282%29.jpg"

const LandingPage = ({
  onGetStarted,
  onExploreSchemes,
  onAskAI,
  onLogin,
  user,
}: {
  onGetStarted: () => void
  onExploreSchemes: () => void
  onAskAI: () => void
  onLogin: () => void
  user: { id: number; name: string; email: string } | null
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "ai">("profile")

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102a43]">
      {/* Utility bar */}
      <div className="bg-[#073b6f] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-xs sm:px-10 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">भारत</span>
            <span className="opacity-50">|</span>
            <span>Government Scheme Information</span>
          </div>
          <span className="hidden sm:block opacity-90">
            Public service information platform
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <img
              src={emblemUrl}
              alt="State Emblem of India"
              className="h-14 w-auto object-contain"
            />

            <div className="h-11 w-px bg-slate-200" />

            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#073b6f]">
                Gov<span className="text-[#0f8a5f]">Assist</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 sm:text-xs">
                Government Scheme Recommendation & AI Assistant
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            <a href="#" className="text-sm font-semibold text-[#073b6f]">
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-[#073b6f]"
            >
              How It Works
            </a>
            <a
              href="#schemes"
              className="text-sm font-medium text-slate-600 hover:text-[#073b6f]"
            >
              Schemes
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-[#073b6f]"
            >
              About
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={onLogin}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#073b6f] hover:bg-slate-50"
            >
              {user ? `Hi, ${user.name.split(" ")[0]}` : "Login"}
            </button>
           <button
  onClick={onGetStarted}
  className="rounded-lg bg-[#073b6f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#062f59]"
>
  Get Started
</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 overflow-hidden">
  <img
    src={heroBackground}
    alt=""
    className="h-full w-full object-cover object-center"
  />
</div>
        {/* Tricolour accent */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe0ef] bg-white/90 px-4 py-2 text-xs font-semibold text-[#073b6f] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#138808]" />
              Discover schemes that may be relevant to you
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#102a43] sm:text-5xl lg:text-6xl">
              Find Government Schemes
              <br />
              <span className="text-[#0b63b6]">That May Fit</span>{" "}
              <span className="text-[#0f8a5f]">Your Profile</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover government schemes, understand available benefits and
              eligibility information, and ask questions through an
              AI-assisted interface designed to make scheme information easier
              to understand.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
  onClick={onGetStarted}
  className="rounded-lg bg-[#073b6f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#073b6f]/15 transition hover:-translate-y-0.5 hover:bg-[#062f59]"
>
  Get Started
</button>
              <button
                onClick={onExploreSchemes}
                className="rounded-lg border border-[#9fb5ca] bg-white/90 px-6 py-3.5 text-sm font-bold text-[#073b6f] backdrop-blur transition hover:bg-white"
              >
                Explore Schemes
              </button>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["01", "Profile-based discovery"],
                ["02", "AI-assisted answers"],
                ["03", "Scheme information"],
                ["04", "Easy to understand"],
              ].map(([number, label]) => (
                <div key={number} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-[#0f8a5f]">
                    {number}
                  </span>
                  <span className="text-xs font-semibold leading-5 text-slate-600">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating preview card */}
          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="absolute -inset-6 rounded-[2rem] bg-white/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl shadow-[#073b6f]/15 backdrop-blur">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 px-5 py-4 text-sm font-bold ${
                    activeTab === "profile"
                      ? "border-b-2 border-[#073b6f] text-[#073b6f]"
                      : "text-slate-400"
                  }`}
                >
                  Your Profile
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`flex-1 px-5 py-4 text-sm font-bold ${
                    activeTab === "ai"
                      ? "border-b-2 border-[#0f8a5f] text-[#0f8a5f]"
                      : "text-slate-400"
                  }`}
                >
                  AI Assistant
                </button>
              </div>

              {activeTab === "profile" ? (
                <div className="p-6">
                  <div className="rounded-xl bg-[#f2f7fb] p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073b6f] text-lg font-bold text-white">
                        N
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#102a43]">
                          Student
                        </p>
                        <p className="text-xs text-slate-500">
                          Tamil Nadu • Age 21
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-[#d8e7f2] bg-white p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0f8a5f]">
                        Potentially Relevant
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#102a43]">
                        Education & Student Schemes
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Recommendations are based on the profile information
                        you provide and available scheme data.
                      </p>
                    </div>
                  </div>

                  <button className="mt-5 w-full rounded-lg bg-[#0f8a5f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b744f]">
                    View Potentially Relevant Schemes
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="rounded-xl bg-[#f2f7fb] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073b6f] text-white">
                        AI
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#102a43]">
                          GovAssist AI
                        </p>
                        <p className="text-xs text-slate-500">
                          Answers grounded in available scheme data
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-[#d8e7f2] bg-white p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Try asking
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#102a43]">
                        “What benefits are available under this scheme?”
                      </p>
                    </div>
                  </div>

                  <button 
                  onClick={onAskAI}
                  className="mt-5 w-full rounded-lg bg-[#073b6f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#062f59]">
                    Ask Our AI Assistant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section id="schemes" className="bg-[#f7f9fc] py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f8a5f]">
              What you can do
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#102a43] sm:text-4xl">
              One place to explore scheme information
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              GovAssist brings profile-based discovery, search and AI-assisted
              information together in one simple interface.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Personalized Discovery",
                text: "Provide your profile details to surface schemes that may be relevant to your circumstances.",
                icon: "01",
              },
              {
                title: "Search & Explore",
                text: "Search scheme information and explore benefits, eligibility details, application information and documents.",
                icon: "02",
              },
              {
                title: "AI Assistant",
                text: "Ask questions about schemes and receive answers grounded in the information available in the scheme dataset.",
                icon: "03",
              },
            ].map((item) => (
              <div
                key={item.icon}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3fb] text-sm font-extrabold text-[#073b6f]">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-lg font-extrabold text-[#102a43]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f8a5f]">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#102a43] sm:text-4xl">
              How GovAssist Works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["1", "Create your profile", "Share basic details such as age, state, occupation and student status."],
              ["2", "Discover schemes", "Explore potentially relevant schemes and search the available scheme information."],
              ["3", "Ask the AI assistant", "Ask questions and get responses based on the retrieved scheme information."],
            ].map(([number, title, text]) => (
              <div key={number} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#073b6f] text-lg font-extrabold text-white">
                  {number}
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-[#102a43]">
                  {title}
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-y border-[#ead7a0] bg-[#fff8df]">
        <div className="mx-auto max-w-[1200px] px-6 py-5 sm:px-10">
          <div className="flex gap-4">
            <div className="mt-0.5 text-lg">ⓘ</div>
            <div>
              <p className="text-sm font-extrabold text-[#6b5410]">
                Important information
              </p>
              <p className="mt-1 text-xs leading-5 text-[#705f28] sm:text-sm">
                GovAssist is a student project for discovering and explaining
                government-scheme information. It is not an official
                Government of India website. Recommendations are only
                potentially relevant matches based on available data and
                should be verified with the concerned official department or
                scheme portal before applying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-[#073b6f] text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <div className="text-xl font-extrabold">
                Gov<span className="text-[#63d6a9]">Assist</span>
              </div>
              <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">
                A student-built platform to make government scheme information
                easier to discover, search and understand.
              </p>
            </div>

            <div className="text-sm text-blue-100">
              <p className="font-semibold text-white">Project</p>
              <p className="mt-2">Government Scheme Recommendation & AI Assistant</p>
              <p className="mt-1">B.E. Computer Science & Engineering</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/15 pt-5 text-xs text-blue-200">
            © 2026 GovAssist. Academic / student project.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
