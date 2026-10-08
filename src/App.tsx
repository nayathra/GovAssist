import { useState } from "react"
import LandingPage from "./pages/LandingPage"
import ProfilePage from "./pages/ProfilePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import AIAssistantPage from "./pages/AIAssistantPage"
import RecommendationsPage from "./pages/RecommendationsPage"
import type { Profile } from "./pages/ProfilePage"

function App() {
  const [page, setPage] = useState<
    "landing" | "profile" | "recommendations" | "schemes" | "details" | "ai"
  >("landing")

  const [selectedScheme, setSelectedScheme] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)

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
      onGetStarted={() => setPage("profile")}
      onExploreSchemes={() => setPage("schemes")}
      onAskAI={() => setPage("ai")}
    />
  )
}

export default App