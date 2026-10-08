import { useState } from "react"
import LandingPage from "./pages/LandingPage"
import ProfilePage from "./pages/ProfilePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import AIAssistantPage from "./pages/AIAssistantPage"

function App() {
  const [page, setPage] = useState<
    "landing" | "profile" | "schemes" | "details" | "ai"
  >("landing")

  const [selectedScheme, setSelectedScheme] = useState("")

  if (page === "profile") {
    return <ProfilePage />
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