import re

from fastapi import APIRouter
from pydantic import BaseModel

from app.data_loader import load_schemes


router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])


class AssistantRequest(BaseModel):
    question: str


def _tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Z0-9]+", text.lower())
        if len(token) > 2
    }


def _rank_scheme(row, query_tokens: set[str]) -> int:
    fields = {
        "scheme_name": 6,
        "eligibility": 5,
        "benefits": 4,
        "details": 3,
        "documents": 2,
        "application": 2,
        "tags": 2,
        "schemeCategory": 1,
        "level": 1,
    }

    score = 0
    for field, weight in fields.items():
        text = str(row.get(field, "")).lower()
        field_tokens = _tokens(text)
        score += len(query_tokens & field_tokens) * weight

    # Exact phrase matches are strong retrieval signals.
    question = " ".join(sorted(query_tokens))
    searchable = " ".join(
        str(row.get(field, "")) for field in fields
    ).lower()
    if question and question in searchable:
        score += 10

    return score


def _snippet(row) -> str:
    for field in ("eligibility", "benefits", "details"):
        value = str(row.get(field, "")).strip()
        if value:
            return value[:420] + ("..." if len(value) > 420 else "")
    return ""


@router.post("")
def ask_assistant(request: AssistantRequest):
    question = request.question.strip()

    if not question:
        return {
            "answer": "Please enter a question about a government scheme.",
            "sources": [],
            "disclaimer": "GovAssist AI answers only from the available scheme data.",
        }

    df = load_schemes()
    query_tokens = _tokens(question)

    ranked = []
    for _, row in df.iterrows():
        score = _rank_scheme(row, query_tokens)
        if score > 0:
            ranked.append((score, row))

    ranked.sort(key=lambda item: item[0], reverse=True)
    top_rows = ranked[:5]

    if not top_rows:
        return {
            "answer": "I couldn't find that information in the available scheme data.",
            "sources": [],
            "disclaimer": "GovAssist AI answers only from the available scheme data and does not guarantee official eligibility.",
        }

    sources = []
    for score, row in top_rows:
        sources.append(
            {
                "scheme_name": str(row.get("scheme_name", "")),
                "slug": str(row.get("slug", "")),
                "eligibility": str(row.get("eligibility", "")),
                "benefits": str(row.get("benefits", "")),
                "details": str(row.get("details", "")),
                "level": str(row.get("level", "")),
                "schemeCategory": str(row.get("schemeCategory", "")),
                "snippet": _snippet(row),
                "retrieval_score": score,
            }
        )

    best = sources[0]
    answer = (
        f"I found scheme information that may help with your question. "
        f"The strongest matching scheme in the available data is "
        f"“{best['scheme_name']}”.\n\n"
        f"{best['snippet']}\n\n"
        "This is retrieved from the GovAssist scheme database. "
        "Please verify the complete eligibility and application requirements "
        "from the relevant official source before applying."
    )

    return {
        "answer": answer,
        "sources": sources,
        "disclaimer": "GovAssist AI answers only from the available scheme data and does not guarantee official eligibility.",
    }
