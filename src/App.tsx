import { useState } from "react"
import LandingPage from "./pages/LandingPage"
import ProfilePage from "./pages/ProfilePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import AIAssistantPage from "./pages/AIAssistantPage"
import RecommendationsPage from "./pages/RecommendationsPage"
import AuthPage from "./pages/AuthPage"
import type { Profile } from "./pages/ProfilePage"

function App() {
  const [page, setPage] = useState<
    "landing" | "auth" | "profile" | "recommendations" | "schemes" | "details" | "ai"
  >("landing")

  const [selectedScheme, setSelectedScheme] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("govassist_user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  if (page === "auth") {
    return (
      <AuthPage
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser)
          setPage("profile")
        }}
        onBack={() => setPage("landing")}
      />
    )
  }

  if (page === "profile") {
    return (
      <ProfilePage
        onFindSchemes={(submittedProfile) => {
          setProfile(submittedProfile)
          setPage("recommendations")
        }}
      />
    )
  }

  if (page === "recommendations" && profile) {
    return (
      <RecommendationsPage
        profile={profile}
        onViewDetails={(schemeSlug) => {
          setSelectedScheme(schemeSlug)
          setPage("details")
        }}
        onExploreSchemes={() => setPage("schemes")}
      />
    )
  }

  if (page === "schemes") {
    return (
      <SchemesPage
        onViewDetails={(schemeSlug) => {
          setSelectedScheme(schemeSlug)
          setPage("details")
        }}
      />
    )
  }

  if (page === "details") {
    return <SchemeDetailsPage schemeSlug={selectedScheme} />
  }

  if (page === "ai") {
    return <AIAssistantPage />
  }

  return (
    <LandingPage
      user={user}
      onLogin={() => setPage("auth")}
      onGetStarted={() => setPage("profile")}
      onExploreSchemes={() => setPage("schemes")}
      onAskAI={() => setPage("ai")}
    />
  )
}

export default App