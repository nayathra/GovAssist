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
    governmentSchemeInfo: "Government Scheme Information",
    publicServicePlatform: "Public service information platform",
    brandTagline: "Government Scheme Recommendation & AI Assistant",
    discoverRelevant: "Discover schemes that may be relevant to you",
    heroTitle: "Find Government Schemes",
    heroFit: "That May Fit",
    heroProfile: "Your Profile",
    heroDescription: "Discover government schemes, understand available benefits and eligibility information, and ask questions through an AI-assisted interface designed to make scheme information easier to understand.",
    profileDiscovery: "Profile-based discovery",
    aiAnswers: "AI-assisted answers",
    schemeInformation: "Scheme information",
    easyUnderstand: "Easy to understand",
    yourProfile: "Your Profile",
    potentiallyRelevant: "Potentially Relevant",
    educationStudentSchemes: "Education & Student Schemes",
    recommendationBasis: "Recommendations are based on the profile information you provide and available scheme data.",
    viewPotential: "View Potentially Relevant Schemes",
    answersGrounded: "Answers grounded in available scheme data",
    tryAsking: "Try asking",
    benefitsQuestion: "What benefits are available under this scheme?",
    askOurAI: "Ask Our AI Assistant",
    whatYouCanDo: "What you can do",
    onePlace: "One place to explore scheme information",
    onePlaceDesc: "GovAssist brings profile-based discovery, search and AI-assisted information together in one simple interface.",
    personalizedDiscovery: "Personalized Discovery",
    personalizedText: "Provide your profile details to surface schemes that may be relevant to your circumstances.",
    searchExplore: "Search & Explore",
    searchExploreText: "Search scheme information and explore benefits, eligibility details, application information and documents.",
    aiAssistantText: "Ask questions about schemes and receive answers grounded in the information available in the scheme dataset.",
    simpleProcess: "Simple process",
    howGovAssist: "How GovAssist Works",
    createProfileStep: "Create your profile",
    createProfileText: "Share basic details such as age, state, occupation and student status.",
    discoverStep: "Discover schemes",
    discoverText: "Explore potentially relevant schemes and search the available scheme information.",
    askAIStep: "Ask the AI assistant",
    askAIText: "Ask questions and get responses based on the retrieved scheme information.",
    importantInfo: "Important information",
    disclaimer: "GovAssist is a student project for discovering and explaining government-scheme information. It is not an official Government of India website. Recommendations are only potentially relevant matches based on available data and should be verified with the concerned official department or scheme portal before applying.",
    footerDesc: "A student-built platform to make government scheme information easier to discover, search and understand.",
    project: "Project",
    academic: "Academic / student project."
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
    governmentSchemeInfo: "அரசுத் திட்ட தகவல்கள்",
    publicServicePlatform: "பொது சேவை தகவல் தளம்",
    brandTagline: "அரசுத் திட்ட பரிந்துரை மற்றும் AI உதவியாளர்",
    discoverRelevant: "உங்களுக்கு பொருத்தமாக இருக்கக்கூடிய திட்டங்களைக் கண்டறியுங்கள்",
    heroTitle: "அரசுத் திட்டங்களைக் கண்டறியுங்கள்",
    heroFit: "உங்கள்",
    heroProfile: "சுயவிவரத்திற்கு பொருந்தக்கூடிய",
    heroDescription: "அரசுத் திட்டங்களைக் கண்டறிந்து, கிடைக்கும் நன்மைகள் மற்றும் தகுதி தகவல்களைப் புரிந்துகொண்டு, திட்டத் தகவல்களை எளிதாகப் புரிந்துகொள்ள AI உதவியாளர் மூலம் கேள்விகளைக் கேளுங்கள்.",
    profileDiscovery: "சுயவிவர அடிப்படையிலான கண்டறிதல்",
    aiAnswers: "AI உதவியுடன் பதில்கள்",
    schemeInformation: "திட்டத் தகவல்கள்",
    easyUnderstand: "எளிதாகப் புரிந்துகொள்ளலாம்",
    yourProfile: "உங்கள் சுயவிவரம்",
    potentiallyRelevant: "சாத்தியமான பொருத்தம்",
    educationStudentSchemes: "கல்வி மற்றும் மாணவர் திட்டங்கள்",
    recommendationBasis: "நீங்கள் வழங்கும் சுயவிவரத் தகவல் மற்றும் கிடைக்கும் திட்டத் தரவின் அடிப்படையில் பரிந்துரைகள் வழங்கப்படுகின்றன.",
    viewPotential: "சாத்தியமான பொருத்தமான திட்டங்களைப் பார்க்க",
    answersGrounded: "கிடைக்கும் திட்டத் தரவை அடிப்படையாகக் கொண்ட பதில்கள்",
    tryAsking: "கேட்டு பாருங்கள்",
    benefitsQuestion: "இந்தத் திட்டத்தின் கீழ் என்ன நன்மைகள் கிடைக்கின்றன?",
    askOurAI: "எங்கள் AI உதவியாளரிடம் கேளுங்கள்",
    whatYouCanDo: "நீங்கள் செய்யக்கூடியவை",
    onePlace: "திட்டத் தகவல்களைப் பார்க்க ஒரே இடம்",
    onePlaceDesc: "சுயவிவர அடிப்படையிலான கண்டறிதல், தேடல் மற்றும் AI உதவியுடன் தகவல்களை GovAssist ஒரே எளிய தளத்தில் வழங்குகிறது.",
    personalizedDiscovery: "தனிப்பயனாக்கப்பட்ட கண்டறிதல்",
    personalizedText: "உங்கள் சுயவிவர விவரங்களை வழங்கி, உங்கள் சூழ்நிலைக்கு பொருத்தமாக இருக்கக்கூடிய திட்டங்களைக் கண்டறியுங்கள்.",
    searchExplore: "தேடல் மற்றும் ஆராய்வு",
    searchExploreText: "திட்டத் தகவல்களைத் தேடி, நன்மைகள், தகுதி, விண்ணப்பத் தகவல்கள் மற்றும் ஆவணங்களைப் பாருங்கள்.",
    aiAssistantText: "திட்டங்களைப் பற்றி கேள்விகளைக் கேட்டு, திட்டத் தரவுத்தொகுப்பில் உள்ள தகவல்களை அடிப்படையாகக் கொண்ட பதில்களைப் பெறுங்கள்.",
    simpleProcess: "எளிய செயல்முறை",
    howGovAssist: "GovAssist எவ்வாறு செயல்படுகிறது",
    createProfileStep: "உங்கள் சுயவிவரத்தை உருவாக்குங்கள்",
    createProfileText: "வயது, மாநிலம், தொழில் மற்றும் மாணவர் நிலை போன்ற அடிப்படை விவரங்களைப் பகிருங்கள்.",
    discoverStep: "திட்டங்களைக் கண்டறியுங்கள்",
    discoverText: "சாத்தியமான பொருத்தமான திட்டங்களைப் பார்த்து, கிடைக்கும் திட்டத் தகவல்களைத் தேடுங்கள்.",
    askAIStep: "AI உதவியாளரிடம் கேளுங்கள்",
    askAIText: "கேள்விகளைக் கேட்டு, பெறப்பட்ட திட்டத் தகவல்களின் அடிப்படையில் பதில்களைப் பெறுங்கள்.",
    importantInfo: "முக்கிய தகவல்",
    disclaimer: "GovAssist என்பது அரசுத் திட்டத் தகவல்களைக் கண்டறிந்து விளக்குவதற்கான மாணவர் திட்டமாகும். இது இந்திய அரசின் அதிகாரப்பூர்வ இணையதளம் அல்ல. பரிந்துரைகள் கிடைக்கும் தரவின் அடிப்படையிலான சாத்தியமான பொருத்தங்கள் மட்டுமே; விண்ணப்பிப்பதற்கு முன் சம்பந்தப்பட்ட அதிகாரப்பூர்வ துறை அல்லது திட்ட இணையதளத்தில் சரிபார்க்கவும்.",
    footerDesc: "அரசுத் திட்டத் தகவல்களை எளிதாகக் கண்டறிந்து, தேடி, புரிந்துகொள்ள உதவும் மாணவர்களால் உருவாக்கப்பட்ட தளம்.",
    project: "திட்டம்",
    academic: "© 2026 GovAssist. கல்வி / மாணவர் திட்டம்."
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
    governmentSchemeInfo: "ప్రభుత్వ పథకాల సమాచారం",
    publicServicePlatform: "ప్రజా సేవా సమాచార వేదిక",
    brandTagline: "ప్రభుత్వ పథకాల సిఫార్సు & AI సహాయకుడు",
    discoverRelevant: "మీకు సంబంధించి ఉండే పథకాలను కనుగొనండి",
    heroTitle: "ప్రభుత్వ పథకాలను కనుగొనండి",
    heroFit: "మీ",
    heroProfile: "ప్రొఫైల్‌కు సరిపోవచ్చు",
    heroDescription: "ప్రభుత్వ పథకాలను కనుగొని, అందుబాటులో ఉన్న ప్రయోజనాలు మరియు అర్హత సమాచారాన్ని అర్థం చేసుకుని, AI సహాయకుడి ద్వారా ప్రశ్నలు అడగండి.",
    profileDiscovery: "ప్రొఫైల్ ఆధారిత శోధన",
    aiAnswers: "AI సహాయంతో సమాధానాలు",
    schemeInformation: "పథకాల సమాచారం",
    easyUnderstand: "సులభంగా అర్థం చేసుకోవచ్చు",
    yourProfile: "మీ ప్రొఫైల్",
    potentiallyRelevant: "సంభావ్యంగా సంబంధిత",
    educationStudentSchemes: "విద్య & విద్యార్థి పథకాలు",
    recommendationBasis: "మీరు అందించే ప్రొఫైల్ సమాచారం మరియు అందుబాటులో ఉన్న పథకాల డేటా ఆధారంగా సిఫార్సులు అందించబడతాయి.",
    viewPotential: "సంభావ్యంగా సంబంధిత పథకాలను చూడండి",
    answersGrounded: "అందుబాటులో ఉన్న పథకాల డేటా ఆధారిత సమాధానాలు",
    tryAsking: "ఇలా అడగండి",
    benefitsQuestion: "ఈ పథకం కింద ఏ ప్రయోజనాలు అందుబాటులో ఉన్నాయి?",
    askOurAI: "మా AI సహాయకుడిని అడగండి",
    whatYouCanDo: "మీరు చేయగలవి",
    onePlace: "పథకాల సమాచారాన్ని అన్వేషించడానికి ఒకే స్థలం",
    onePlaceDesc: "GovAssist ప్రొఫైల్ ఆధారిత శోధన, సెర్చ్ మరియు AI సహాయంతో సమాచారాన్ని ఒకే సులభమైన వేదికలో అందిస్తుంది.",
    personalizedDiscovery: "వ్యక్తిగతీకరించిన శోధన",
    personalizedText: "మీ ప్రొఫైల్ వివరాలను అందించి, మీ పరిస్థితులకు సంబంధించి ఉండే పథకాలను కనుగొనండి.",
    searchExplore: "శోధించండి & అన్వేషించండి",
    searchExploreText: "పథకాల సమాచారాన్ని వెతికి, ప్రయోజనాలు, అర్హత, దరఖాస్తు సమాచారం మరియు పత్రాలను అన్వేషించండి.",
    aiAssistantText: "పథకాల గురించి ప్రశ్నలు అడిగి, పథకాల డేటాసెట్‌లో అందుబాటులో ఉన్న సమాచారంపై ఆధారపడిన సమాధానాలను పొందండి.",
    simpleProcess: "సులభమైన ప్రక్రియ",
    howGovAssist: "GovAssist ఎలా పనిచేస్తుంది",
    createProfileStep: "మీ ప్రొఫైల్ సృష్టించండి",
    createProfileText: "వయస్సు, రాష్ట్రం, వృత్తి మరియు విద్యార్థి స్థితి వంటి ప్రాథమిక వివరాలను పంచుకోండి.",
    discoverStep: "పథకాలను కనుగొనండి",
    discoverText: "సంభావ్యంగా సంబంధిత పథకాలను అన్వేషించి, అందుబాటులో ఉన్న పథకాల సమాచారాన్ని శోధించండి.",
    askAIStep: "AI సహాయకుడిని అడగండి",
    askAIText: "ప్రశ్నలు అడిగి, పొందిన పథకాల సమాచారంపై ఆధారపడిన సమాధానాలను పొందండి.",
    importantInfo: "ముఖ్యమైన సమాచారం",
    disclaimer: "GovAssist ప్రభుత్వ పథకాల సమాచారాన్ని కనుగొని వివరించడానికి రూపొందించిన విద్యార్థి ప్రాజెక్ట్. ఇది భారత ప్రభుత్వ అధికారిక వెబ్‌సైట్ కాదు. సిఫార్సులు అందుబాటులో ఉన్న డేటా ఆధారంగా సంభావ్యంగా సంబంధిత సరిపోలికలు మాత్రమే; దరఖాస్తు చేయడానికి ముందు సంబంధిత అధికారిక విభాగం లేదా పథకం పోర్టల్‌లో ధృవీకరించండి.",
    footerDesc: "ప్రభుత్వ పథకాల సమాచారాన్ని సులభంగా కనుగొని, శోధించి, అర్థం చేసుకోవడానికి విద్యార్థులు రూపొందించిన వేదిక.",
    project: "ప్రాజెక్ట్",
    academic: "© 2026 GovAssist. విద్యా / విద్యార్థి ప్రాజెక్ట్."
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
