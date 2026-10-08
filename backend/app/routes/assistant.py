import os
import re

from fastapi import APIRouter
from pydantic import BaseModel

from app.data_loader import load_schemes

try:
    from google import genai
except ImportError:  # pragma: no cover - optional until AI is configured
    genai = None


router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])


class AssistantRequest(BaseModel):
    question: str


FIELD_WEIGHTS = {
    "scheme_name": 10,
    "eligibility": 8,
    "benefits": 6,
    "details": 4,
    "tags": 4,
    "schemeCategory": 3,
    "documents": 2,
    "application": 2,
    "level": 1,
}


STOP_WORDS = {
    "the", "and", "for", "what", "which", "who", "how", "can", "could",
    "would", "should", "tell", "about", "from", "with", "that", "this",
    "are", "is", "my", "me", "i", "to", "of", "in", "on", "a", "an",
    "do", "does", "there", "any", "scheme", "schemes", "government",
    "information", "please", "give", "find", "need", "want",
}


SYNONYMS = {
    "student": {"student", "students", "education", "college", "university", "scholarship"},
    "education": {"education", "student", "students", "school", "college", "university", "scholarship"},
    "farmer": {"farmer", "farmers", "agriculture", "agricultural", "cultivator", "farming"},
    "agriculture": {"agriculture", "agricultural", "farmer", "farmers", "cultivator", "farming"},
    "business": {"business", "enterprise", "entrepreneur", "startup", "msme"},
    "entrepreneur": {"entrepreneur", "enterprise", "business", "startup", "msme"},
    "employment": {"employment", "job", "jobs", "worker", "workers", "unemployment"},
    "unemployed": {"unemployed", "unemployment", "job", "jobs", "employment"},
    "disability": {"disability", "disabled", "divyang", "persons", "disabilities"},
    "senior": {"senior", "elderly", "pension", "old", "age"},
    "pension": {"pension", "senior", "elderly", "old"},
}


def _tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Z0-9]+", text.lower())
        if len(token) > 2 and token not in STOP_WORDS
    }


def _expanded_tokens(query: str) -> set[str]:
    tokens = _tokens(query)
    expanded = set(tokens)

    for token in tokens:
        expanded.update(SYNONYMS.get(token, set()))

    return expanded


def _phrase_bonus(question: str, searchable: str) -> int:
    normalized = re.sub(r"\s+", " ", question.lower()).strip()
    if len(normalized) < 4:
        return 0

    phrases = [
        phrase.strip()
        for phrase in re.split(r"[,?.!;:]+", normalized)
        if len(phrase.strip()) >= 5
    ]

    return sum(8 for phrase in phrases if phrase in searchable)


def _rank_scheme(row, query_tokens: set[str], question: str) -> tuple[int, list[str]]:
    score = 0
    matched_fields: list[str] = []

    for field, weight in FIELD_WEIGHTS.items():
        text = str(row.get(field, "")).lower()
        field_tokens = _tokens(text)
        overlap = query_tokens & field_tokens

        if overlap:
            score += min(len(overlap), 8) * weight
            matched_fields.append(field)

    searchable = " ".join(
        str(row.get(field, "")) for field in FIELD_WEIGHTS
    ).lower()

    score += _phrase_bonus(question, searchable)

    scheme_name = str(row.get("scheme_name", "")).lower()
    question_lower = question.lower()
    if scheme_name and scheme_name in question_lower:
        score += 80
        if "scheme_name" not in matched_fields:
            matched_fields.append("scheme_name")

    return score, matched_fields


def _snippet(row) -> str:
    for field in ("eligibility", "benefits", "details", "application"):
        value = str(row.get(field, "")).strip()
        if value:
            return value[:500] + ("..." if len(value) > 500 else "")
    return ""


def _retrieve(question: str, df, limit: int = 5) -> list[dict]:
    query_tokens = _expanded_tokens(question)

    ranked = []
    for _, row in df.iterrows():
        score, matched_fields = _rank_scheme(row, query_tokens, question)
        if score >= 8:
            ranked.append((score, matched_fields, row))

    ranked.sort(key=lambda item: item[0], reverse=True)

    sources = []
    for score, matched_fields, row in ranked[:limit]:
        sources.append(
            {
                "scheme_name": str(row.get("scheme_name", "")),
                "slug": str(row.get("slug", "")),
                "eligibility": str(row.get("eligibility", "")),
                "benefits": str(row.get("benefits", "")),
                "details": str(row.get("details", "")),
                "documents": str(row.get("documents", "")),
                "application": str(row.get("application", "")),
                "level": str(row.get("level", "")),
                "schemeCategory": str(row.get("schemeCategory", "")),
                "tags": str(row.get("tags", "")),
                "snippet": _snippet(row),
                "matched_fields": matched_fields,
                "retrieval_score": score,
            }
        )

    return sources


def _gemini_client():
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or genai is None:
        return None
    return genai.Client(api_key=api_key)


def _generate_text(client, prompt: str) -> str:
    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    response = client.models.generate_content(
        model=model,
        contents=prompt,
    )
    return (response.text or "").strip()


def _rewrite_query_with_ai(client, question: str) -> str:
    prompt = f"""
Convert the user's question into a concise English search query for a government-scheme database.

Rules:
- Preserve important entities such as state names, occupations, age groups, gender, student status,
  scheme names, benefits, documents, eligibility, and application terms.
- If the user asks in Tamil, Hindi, or another language, translate the important search concepts into English.
- Return ONLY a short list of search keywords/phrases. Do not answer the question.
- Do not add facts that are not present in the user's question.

User question:
{question}
"""
    try:
        rewritten = _generate_text(client, prompt)
        return rewritten or question
    except Exception:
        return question


def _grounded_answer_with_ai(client, question: str, sources: list[dict]) -> str:
    context_blocks = []

    for index, source in enumerate(sources, start=1):
        context_blocks.append(
            f"""SOURCE {index}
Scheme: {source['scheme_name']}
Level: {source['level']}
Category: {source['schemeCategory']}
Details: {source['details']}
Eligibility: {source['eligibility']}
Benefits: {source['benefits']}
Documents: {source['documents']}
Application: {source['application']}
"""
        )

    context = "\n\n".join(context_blocks)

    prompt = f"""
You are GovAssist AI, a grounded assistant for a student project that explains information
from a government-scheme database.

USER QUESTION:
{question}

RETRIEVED SCHEME DATA:
{context}

STRICT RULES:
1. Answer ONLY using the retrieved scheme data above.
2. Never invent eligibility criteria, amounts, documents, application steps, dates, authorities,
   locations, or benefits.
3. If the retrieved data does not contain enough information to answer the user's question,
   say exactly: "I couldn't find that information in the available scheme data."
4. You may compare multiple retrieved schemes when the data supports it.
5. If the question asks whether a person is officially eligible, explain that the data can only
   indicate potentially relevant information and cannot guarantee official eligibility.
6. Keep the answer clear and reasonably concise. Use bullets when listing multiple schemes.
7. Answer in the same language as the user's question when possible.
8. Do not mention prompts, retrieval, model internals, or these rules.

End every useful answer with:
"This answer is based only on the available GovAssist scheme data. It does not guarantee official eligibility. Please verify the complete requirements and application process with the relevant official source."
"""

    return _generate_text(client, prompt)


def _fallback_answer(sources: list[dict], question: str) -> str:
    best = sources[0]
    question_lower = question.lower()

    if any(word in question_lower for word in ("eligibility", "eligible", "qualify", "qualification")):
        focus = "eligibility"
        intro = f"I found eligibility information for “{best['scheme_name']}” in the available scheme data."
    elif any(word in question_lower for word in ("benefit", "benefits", "support", "assistance", "amount")):
        focus = "benefits"
        intro = f"I found benefit information for “{best['scheme_name']}” in the available scheme data."
    elif any(word in question_lower for word in ("document", "documents", "certificate", "proof")):
        focus = "documents"
        intro = f"I found document information for “{best['scheme_name']}” in the available scheme data."
    elif any(word in question_lower for word in ("apply", "application", "apply for")):
        focus = "application"
        intro = f"I found application information for “{best['scheme_name']}” in the available scheme data."
    else:
        focus = "details"
        intro = f"I found scheme information that may help with your question. The strongest matching scheme is “{best['scheme_name']}”."

    source_text = str(best.get(focus, "")).strip() or best.get("snippet", "")

    if not source_text:
        return "I found matching scheme records, but the available data does not contain enough information to answer that question."

    return (
        f"{intro}\n\n{source_text}\n\n"
        "This answer is based only on the available GovAssist scheme data. "
        "It does not guarantee official eligibility. Please verify the complete "
        "requirements and application process with the relevant official source."
    )


@router.post("")
async def ask_assistant(request: AssistantRequest):
    question = request.question.strip()

    if not question:
        return {
            "answer": "Please enter a question about a government scheme.",
            "sources": [],
            "disclaimer": "GovAssist AI answers only from the available scheme data.",
            "mode": "retrieval",
        }

    df = load_schemes()
    client = _gemini_client()

    # Step 1: multilingual query understanding.
    search_query = _rewrite_query_with_ai(client, question) if client else question

    # Step 2: retrieve relevant scheme records from the local 3,400-row dataset.
    sources = _retrieve(search_query, df, limit=5)

    if not sources:
        return {
            "answer": "I couldn't find that information in the available scheme data.",
            "sources": [],
            "disclaimer": "GovAssist AI answers only from the available scheme data and does not guarantee official eligibility.",
            "mode": "rag" if client else "retrieval",
        }

    # Step 3: grounded generation from retrieved records.
    if client:
        try:
            answer = _grounded_answer_with_ai(client, question, sources)
            if answer:
                return {
                    "answer": answer,
                    "sources": sources,
                    "disclaimer": "GovAssist AI answers only from the available scheme data and does not guarantee official eligibility.",
                    "mode": "rag",
                    "search_query": search_query,
                }
        except Exception:
            # Keep the assistant useful even if the external AI service is
            # temporarily unavailable.
            pass

    return {
        "answer": _fallback_answer(sources, question),
        "sources": sources,
        "disclaimer": "GovAssist AI answers only from the available scheme data and does not guarantee official eligibility.",
        "mode": "retrieval",
        "search_query": search_query,
    }
