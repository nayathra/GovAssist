import { useState } from "react"
import LandingPage from "./pages/LandingPage"
import ProfilePage from "./pages/ProfilePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import AIAssistantPage from "./pages/AIAssistantPage"
import RecommendationsPage from "./pages/RecommendationsPage"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import type { Profile } from "./pages/ProfilePage"
import { LanguageProvider } from "./i18n"

type Page = "landing" | "auth" | "dashboard" | "profile" | "recommendations" | "schemes" | "details" | "ai"

function AppContent() {
  const [pageStack, setPageStack] = useState<Page[]>(["landing"])
  const page = pageStack[pageStack.length - 1]
  const [visitedPages, setVisitedPages] = useState<Set<Page>>(() => new Set(["landing"]))
  const [selectedScheme, setSelectedScheme] = useState("")
  const [profile, setProfile] = useState<Profile | null>(() => {
    const savedProfile = localStorage.getItem("govassist_profile")
    return savedProfile ? JSON.parse(savedProfile) : null
  })
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("govassist_user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const navigate = (nextPage: Page) => {
    setVisitedPages((current) => new Set(current).add(nextPage))
    setPageStack((current) => [...current, nextPage])
  }

  const goBack = () => {
    setPageStack((current) => current.length > 1 ? current.slice(0, -1) : current)
  }

  const openScheme = (schemeSlug: string) => {
    setSelectedScheme(schemeSlug)
    navigate("details")
  }

  return (
    <>
      <div className={page === "landing" ? "block" : "hidden"}>
        <LandingPage
          user={user}
          onLogin={() => navigate(user ? "dashboard" : "auth")}
          onGetStarted={() => navigate("profile")}
          onExploreSchemes={() => navigate("schemes")}
          onAskAI={() => navigate("ai")}
        />
      </div>

      {visitedPages.has("auth") && (
        <div className={page === "auth" ? "block" : "hidden"}>
          <AuthPage
            onSuccess={(authenticatedUser) => {
              setUser(authenticatedUser)
              localStorage.setItem("govassist_user", JSON.stringify(authenticatedUser))
              navigate("dashboard")
            }}
            onBack={goBack}
          />
        </div>
      )}

      {user && visitedPages.has("dashboard") && (
        <div className={page === "dashboard" ? "block" : "hidden"}>
          <DashboardPage
            user={user}
            profile={profile}
            onProfile={() => navigate("profile")}
            onRecommendations={() => navigate("recommendations")}
            onSchemes={() => navigate("schemes")}
            onAI={() => navigate("ai")}
            onViewScheme={openScheme}
            onHome={() => navigate("landing")}
            onLogout={() => {
              localStorage.removeItem("govassist_user")
              setUser(null)
              setPageStack(["landing"])
            }}
          />
        </div>
      )}

      {visitedPages.has("profile") && (
        <div className={page === "profile" ? "block" : "hidden"}>
          <ProfilePage
            initialProfile={profile}
            onBack={goBack}
            onFindSchemes={(submittedProfile) => {
              setProfile(submittedProfile)
              localStorage.setItem("govassist_profile", JSON.stringify(submittedProfile))
              navigate("recommendations")
            }}
          />
        </div>
      )}

      {visitedPages.has("recommendations") && profile && (
        <div className={page === "recommendations" ? "block" : "hidden"}>
          <RecommendationsPage
            profile={profile}
            onBack={goBack}
            onViewDetails={openScheme}
            onExploreSchemes={() => navigate("schemes")}
          />
        </div>
      )}

      {visitedPages.has("schemes") && (
        <div className={page === "schemes" ? "block" : "hidden"}>
          <SchemesPage onBack={goBack} onViewDetails={openScheme} />
        </div>
      )}

      {visitedPages.has("details") && (
        <div className={page === "details" ? "block" : "hidden"}>
          <SchemeDetailsPage schemeSlug={selectedScheme} onBack={goBack} />
        </div>
      )}

      {visitedPages.has("ai") && (
        <div className={page === "ai" ? "block" : "hidden"}>
          <AIAssistantPage onBack={goBack} />
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
