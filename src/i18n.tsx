import { createContext, useContext, useEffect, useMemo, useState } from "react"

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "ml", label: "മലയാളം" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]["code"]

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    language: "Language", back: "← Back", home: "Home", login: "Login", logout: "Logout",
    getStarted: "Get Started", exploreSchemes: "Explore Schemes", howItWorks: "How It Works",
    about: "About", schemes: "Schemes", profile: "Profile", dashboard: "Dashboard",
    aiAssistant: "AI Assistant", overview: "Overview", eligibility: "Eligibility",
    benefits: "Benefits", documents: "Documents", howToApply: "How to Apply",
    schemeSummary: "Scheme Summary", important: "Important", search: "Search schemes...",
    viewDetails: "View Details →", next: "Next →", previous: "← Previous",
    noMatching: "No matching schemes found", loading: "Loading...",
    createProfile: "Create Your Profile", updateProfile: "Update Profile",
    recommendations: "My Recommendations", recentActivity: "Recent Activity",
    recentlyViewed: "Recently Viewed Schemes", open: "Open →", send: "Send",
    clearChat: "Clear Chat", suggestedQuestions: "Suggested Questions",
    email: "Email address", password: "Password", fullName: "Full name",
    createAccount: "Create Account", welcomeBack: "Welcome back", pleaseWait: "Please wait...",
    state: "State", occupation: "Occupation", age: "Age", student: "Student",
    ready: "Ready", incomplete: "Incomplete", completeProfile: "Complete your profile",
    schemeOverview: "Scheme Overview", requiredDocuments: "Required Documents",
    applicationInfo: "Application Information →", informationAvailable: "Information Available",
  },
  ta: {
    language: "மொழி", back: "← பின்செல்", home: "முகப்பு", login: "உள்நுழைவு", logout: "வெளியேறு",
    getStarted: "தொடங்குங்கள்", exploreSchemes: "திட்டங்களைப் பார்க்க", howItWorks: "எப்படி செயல்படுகிறது",
    about: "எங்களைப் பற்றி", schemes: "திட்டங்கள்", profile: "சுயவிவரம்", dashboard: "முகப்புப் பலகை",
    aiAssistant: "AI உதவியாளர்", overview: "கண்ணோட்டம்", eligibility: "தகுதி",
    benefits: "நன்மைகள்", documents: "ஆவணங்கள்", howToApply: "எப்படி விண்ணப்பிப்பது",
    schemeSummary: "திட்ட சுருக்கம்", important: "முக்கியம்", search: "திட்டங்களைத் தேடுங்கள்...",
    viewDetails: "விவரங்களைப் பார்க்க →", next: "அடுத்து →", previous: "← முந்தையது",
    noMatching: "பொருந்தும் திட்டங்கள் எதுவும் கிடைக்கவில்லை", loading: "ஏற்றுகிறது...",
    createProfile: "உங்கள் சுயவிவரத்தை உருவாக்குங்கள்", updateProfile: "சுயவிவரத்தைப் புதுப்பிக்கவும்",
    recommendations: "எனது பரிந்துரைகள்", recentActivity: "சமீபத்திய செயல்பாடு",
    recentlyViewed: "சமீபத்தில் பார்த்த திட்டங்கள்", open: "திறக்க →", send: "அனுப்பு",
    clearChat: "உரையாடலை அழிக்க", suggestedQuestions: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்", fullName: "முழுப் பெயர்",
    createAccount: "கணக்கை உருவாக்கு", welcomeBack: "மீண்டும் வரவேற்கிறோம்", pleaseWait: "காத்திருக்கவும்...",
    state: "மாநிலம்", occupation: "தொழில்", age: "வயது", student: "மாணவர்",
    ready: "தயார்", incomplete: "முழுமையில்லை", completeProfile: "உங்கள் சுயவிவரத்தை முடிக்கவும்",
    schemeOverview: "திட்டத்தின் கண்ணோட்டம்", requiredDocuments: "தேவையான ஆவணங்கள்",
    applicationInfo: "விண்ணப்பத் தகவல் →", informationAvailable: "தகவல் கிடைக்கிறது",
  },
  te: {
    language: "భాష", back: "← వెనక్కి", home: "హోమ్", login: "లాగిన్", logout: "లాగ్ అవుట్",
    getStarted: "ప్రారంభించండి", exploreSchemes: "పథకాలను చూడండి", howItWorks: "ఎలా పనిచేస్తుంది",
    about: "మా గురించి", schemes: "పథకాలు", profile: "ప్రొఫైల్", dashboard: "డ్యాష్‌బోర్డ్",
    aiAssistant: "AI సహాయకుడు", overview: "అవలోకనం", eligibility: "అర్హత",
    benefits: "ప్రయోజనాలు", documents: "పత్రాలు", howToApply: "ఎలా దరఖాస్తు చేయాలి",
    schemeSummary: "పథకం సారాంశం", important: "ముఖ్యమైనది", search: "పథకాలను వెతకండి...",
    viewDetails: "వివరాలు చూడండి →", next: "తదుపరి →", previous: "← మునుపటి",
    noMatching: "సరిపోలే పథకాలు కనుగొనబడలేదు", loading: "లోడ్ అవుతోంది...",
    createProfile: "మీ ప్రొఫైల్‌ను సృష్టించండి", updateProfile: "ప్రొఫైల్‌ను నవీకరించండి",
    recommendations: "నా సిఫార్సులు", recentActivity: "ఇటీవలి కార్యకలాపం",
    recentlyViewed: "ఇటీవల చూసిన పథకాలు", open: "తెరవండి →", send: "పంపండి",
    clearChat: "చాట్‌ను క్లియర్ చేయండి", suggestedQuestions: "సూచించిన ప్రశ్నలు",
    email: "ఇమెయిల్ చిరునామా", password: "పాస్‌వర్డ్", fullName: "పూర్తి పేరు",
    createAccount: "ఖాతాను సృష్టించండి", welcomeBack: "తిరిగి స్వాగతం", pleaseWait: "దయచేసి వేచి ఉండండి...",
    state: "రాష్ట్రం", occupation: "వృత్తి", age: "వయస్సు", student: "విద్యార్థి",
    ready: "సిద్ధంగా ఉంది", incomplete: "పూర్తి కాలేదు", completeProfile: "ముందుగా మీ ప్రొఫైల్‌ను పూర్తి చేయండి",
    schemeOverview: "పథకం అవలోకనం", requiredDocuments: "అవసరమైన పత్రాలు",
    applicationInfo: "దరఖాస్తు సమాచారం →", informationAvailable: "సమాచారం అందుబాటులో ఉంది",
  },
  hi: {
    language: "भाषा", back: "← वापस", home: "होम", login: "लॉग इन", logout: "लॉग आउट",
    getStarted: "शुरू करें", exploreSchemes: "योजनाएँ देखें", howItWorks: "यह कैसे काम करता है",
    about: "हमारे बारे में", schemes: "योजनाएँ", profile: "प्रोफ़ाइल", dashboard: "डैशबोर्ड",
    aiAssistant: "AI सहायक", overview: "सारांश", eligibility: "पात्रता",
    benefits: "लाभ", documents: "दस्तावेज़", howToApply: "आवेदन कैसे करें",
    schemeSummary: "योजना सारांश", important: "महत्वपूर्ण", search: "योजनाएँ खोजें...",
    viewDetails: "विवरण देखें →", next: "अगला →", previous: "← पिछला",
    noMatching: "कोई मिलती-जुलती योजना नहीं मिली", loading: "लोड हो रहा है...",
    createProfile: "अपनी प्रोफ़ाइल बनाएँ", updateProfile: "प्रोफ़ाइल अपडेट करें",
    recommendations: "मेरी सिफारिशें", recentActivity: "हाल की गतिविधि",
    recentlyViewed: "हाल ही में देखी गई योजनाएँ", open: "खोलें →", send: "भेजें",
    clearChat: "चैट साफ़ करें", suggestedQuestions: "सुझाए गए प्रश्न",
    email: "ईमेल पता", password: "पासवर्ड", fullName: "पूरा नाम",
    createAccount: "खाता बनाएँ", welcomeBack: "वापसी पर स्वागत है", pleaseWait: "कृपया प्रतीक्षा करें...",
    state: "राज्य", occupation: "व्यवसाय", age: "आयु", student: "विद्यार्थी",
    ready: "तैयार", incomplete: "अपूर्ण", completeProfile: "पहले अपनी प्रोफ़ाइल पूरी करें",
    schemeOverview: "योजना का सारांश", requiredDocuments: "आवश्यक दस्तावेज़",
    applicationInfo: "आवेदन की जानकारी →", informationAvailable: "जानकारी उपलब्ध है",
  },
  ml: {
    language: "ഭാഷ", back: "← തിരികെ", home: "ഹോം", login: "ലോഗിൻ", logout: "ലോഗ് ഔട്ട്",
    getStarted: "ആരംഭിക്കുക", exploreSchemes: "പദ്ധതികൾ കാണുക", howItWorks: "എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    about: "ഞങ്ങളെക്കുറിച്ച്", schemes: "പദ്ധതികൾ", profile: "പ്രൊഫൈൽ", dashboard: "ഡാഷ്ബോർഡ്",
    aiAssistant: "AI സഹായി", overview: "അവലോകനം", eligibility: "യോഗ്യത",
    benefits: "ആനുകൂല്യങ്ങൾ", documents: "രേഖകൾ", howToApply: "എങ്ങനെ അപേക്ഷിക്കാം",
    schemeSummary: "പദ്ധതി സംഗ്രഹം", important: "പ്രധാനപ്പെട്ടത്", search: "പദ്ധതികൾ തിരയുക...",
    viewDetails: "വിശദാംശങ്ങൾ കാണുക →", next: "അടുത്തത് →", previous: "← മുമ്പത്തെ",
    noMatching: "പൊരുത്തപ്പെടുന്ന പദ്ധതികളൊന്നും കണ്ടെത്തിയില്ല", loading: "ലോഡ് ചെയ്യുന്നു...",
    createProfile: "നിങ്ങളുടെ പ്രൊഫൈൽ സൃഷ്ടിക്കുക", updateProfile: "പ്രൊഫൈൽ പുതുക്കുക",
    recommendations: "എന്റെ ശുപാർശകൾ", recentActivity: "സമീപകാല പ്രവർത്തനം",
    recentlyViewed: "അടുത്തിടെ കണ്ട പദ്ധതികൾ", open: "തുറക്കുക →", send: "അയയ്ക്കുക",
    clearChat: "ചാറ്റ് മായ്ക്കുക", suggestedQuestions: "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ",
    email: "ഇമെയിൽ വിലാസം", password: "പാസ്‌വേഡ്", fullName: "പൂർണ്ണ പേര്",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക", welcomeBack: "വീണ്ടും സ്വാഗതം", pleaseWait: "ദയവായി കാത്തിരിക്കുക...",
    state: "സംസ്ഥാനം", occupation: "തൊഴിൽ", age: "പ്രായം", student: "വിദ്യാർത്ഥി",
    ready: "തയ്യാർ", incomplete: "പൂർത്തിയാക്കിയിട്ടില്ല", completeProfile: "ആദ്യം നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
    schemeOverview: "പദ്ധതി അവലോകനം", requiredDocuments: "ആവശ്യമായ രേഖകൾ",
    applicationInfo: "അപേക്ഷാ വിവരങ്ങൾ →", informationAvailable: "വിവരം ലഭ്യമാണ്",
  },
  kn: {
    language: "ಭಾಷೆ", back: "← ಹಿಂದೆ", home: "ಮುಖಪುಟ", login: "ಲಾಗಿನ್", logout: "ಲಾಗ್ ಔಟ್",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ", exploreSchemes: "ಯೋಜನೆಗಳನ್ನು ನೋಡಿ", howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ", schemes: "ಯೋಜನೆಗಳು", profile: "ಪ್ರೊಫೈಲ್", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    aiAssistant: "AI ಸಹಾಯಕ", overview: "ಅವಲೋಕನ", eligibility: "ಅರ್ಹತೆ",
    benefits: "ಪ್ರಯೋಜನಗಳು", documents: "ದಾಖಲೆಗಳು", howToApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ",
    schemeSummary: "ಯೋಜನೆ ಸಾರಾಂಶ", important: "ಪ್ರಮುಖ", search: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ →", next: "ಮುಂದೆ →", previous: "← ಹಿಂದಿನ",
    noMatching: "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    createProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ", updateProfile: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಿ",
    recommendations: "ನನ್ನ ಶಿಫಾರಸುಗಳು", recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    recentlyViewed: "ಇತ್ತೀಚೆಗೆ ವೀಕ್ಷಿಸಿದ ಯೋಜನೆಗಳು", open: "ತೆರೆಯಿರಿ →", send: "ಕಳುಹಿಸಿ",
    clearChat: "ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ", suggestedQuestions: "ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು",
    email: "ಇಮೇಲ್ ವಿಳಾಸ", password: "ಪಾಸ್‌ವರ್ಡ್", fullName: "ಪೂರ್ಣ ಹೆಸರು",
    createAccount: "ಖಾತೆ ರಚಿಸಿ", welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ", pleaseWait: "ದಯವಿಟ್ಟು ಕಾಯಿರಿ...",
    state: "ರಾಜ್ಯ", occupation: "ಉದ್ಯೋಗ", age: "ವಯಸ್ಸು", student: "ವಿದ್ಯಾರ್ಥಿ",
    ready: "ಸಿದ್ಧ", incomplete: "ಅಪೂರ್ಣ", completeProfile: "ಮೊದಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    schemeOverview: "ಯೋಜನೆಯ ಅವಲೋಕನ", requiredDocuments: "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
    applicationInfo: "ಅರ್ಜಿ ಮಾಹಿತಿ →", informationAvailable: "ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ",
  },
}

type LanguageContextValue = {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("govassist_language") as LanguageCode | null
    return saved && translations[saved] ? saved : "en"
  })

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next)
    localStorage.setItem("govassist_language", next)
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: string) => translations[language][key] || translations.en[key] || key,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const value = useContext(LanguageContext)
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider")
  return value
}

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold text-slate-500 sm:block">{t("language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#073b6f]"
        aria-label={t("language")}
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>{item.label}</option>
        ))}
      </select>
    </div>
  )
}
