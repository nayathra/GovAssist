from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.data_loader import load_schemes


router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


class ProfileRequest(BaseModel):
    name: str = ""
    age: str = ""
    gender: str = ""
    state: str = ""
    district: str = ""
    occupation: str = ""
    education: str = ""
    employmentStatus: str = ""
    studentStatus: str = ""
    income: str = ""
    socialCategory: str = ""
    maritalStatus: str = ""
    disabilityStatus: str = ""
    residence: str = ""
    landStatus: str = ""
    businessStatus: str = ""
    businessType: str = ""


def _text(row) -> str:
    fields = ["scheme_name", "details", "benefits", "eligibility", "application", "documents", "tags", "schemeCategory", "level"]
    return " ".join(str(row.get(field, "")) for field in fields).lower()


def _has(text: str, *values: str) -> bool:
    return any(value.lower() in text for value in values if value)


def _add_match(matches: list[str], label: str) -> None:
    if label not in matches:
        matches.append(label)


def _score_profile(row, profile: ProfileRequest) -> Optional[tuple[int, list[str]]]:
    text = _text(row)
    score = 0
    matches: list[str] = []

    if profile.state and profile.state != "Other / All India" and _has(text, profile.state):
        score += 25
        _add_match(matches, "State")

    occupation_groups = {
        "Student": ("student", "education", "scholarship", "college", "higher education"),
        "Farmer": ("farmer", "farming", "agriculture", "agricultural"),
        "Agricultural Worker": ("agricultural worker", "agriculture", "farm worker"),
        "Government Employee": ("government employee", "government servant"),
        "Private Employee": ("private employee", "worker", "employee"),
        "Self-Employed": ("self employed", "self-employed", "enterprise", "business"),
        "Business Owner": ("business", "enterprise", "entrepreneur"),
        "Entrepreneur": ("entrepreneur", "enterprise", "startup", "business"),
        "Daily Wage / Labour Worker": ("daily wage", "labour", "labor", "worker"),
        "Construction Worker": ("construction worker", "construction", "building worker"),
        "Artisan / Craftsman": ("artisan", "craftsman", "handicraft"),
        "Fisherman / Fisherwoman": ("fisherman", "fisherwoman", "fisher", "fisheries"),
        "Weaver": ("weaver", "weaving", "handloom"),
        "Unemployed": ("unemployed", "unemployment", "job seeker"),
        "Homemaker": ("homemaker", "housewife"),
        "Retired / Senior Citizen": ("senior citizen", "elderly", "pensioner", "retired"),
    }

    if profile.occupation:
        terms = occupation_groups.get(profile.occupation, (profile.occupation,))
        if _has(text, *terms):
            score += 22
            _add_match(matches, "Occupation / beneficiary type")

    if profile.studentStatus == "Yes" and _has(text, "student", "scholarship", "education", "college", "university"):
        score += 20
        _add_match(matches, "Student status")

    if profile.education and _has(text, profile.education):
        score += 10
        _add_match(matches, "Education")

    if profile.gender and profile.gender not in {"Prefer not to say", "Transgender"} and _has(text, profile.gender):
        score += 10
        _add_match(matches, "Gender")

    if profile.socialCategory and profile.socialCategory not in {"Prefer not to say", "General"} and _has(text, profile.socialCategory):
        score += 10
        _add_match(matches, "Social category")

    if profile.disabilityStatus == "Yes" and _has(text, "disability", "disabled", "divyang", "persons with disabilities"):
        score += 12
        _add_match(matches, "Disability status")

    if profile.residence and profile.residence != "Prefer not to say" and _has(text, profile.residence):
        score += 8
        _add_match(matches, "Residence")

    if profile.maritalStatus and profile.maritalStatus != "Prefer not to say" and _has(text, profile.maritalStatus, profile.maritalStatus.split(" / ")[0]):
        score += 8
        _add_match(matches, "Marital status")

    if profile.age:
        try:
            age = int(profile.age)
            if (age < 18 and _has(text, "below 18", "minor")) or (18 <= age <= 25 and _has(text, "18", "21", "22", "23", "24", "25", "youth")) or (26 <= age <= 40 and _has(text, "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40")) or (age >= 60 and _has(text, "60", "senior citizen", "elderly", "old age")):
                score += 10
                _add_match(matches, "Age")
        except ValueError:
            pass

    if profile.income and profile.income != "Prefer not to say":
        income_terms = {
            "Below ₹1 Lakh": ("below", "1 lakh", "low income", "economically weaker"),
            "₹1 Lakh – ₹2.5 Lakh": ("1 lakh", "2.5 lakh"),
            "₹2.5 Lakh – ₹5 Lakh": ("2.5 lakh", "5 lakh"),
            "₹5 Lakh – ₹10 Lakh": ("5 lakh", "10 lakh"),
            "Above ₹10 Lakh": ("10 lakh",),
        }
        if _has(text, *income_terms.get(profile.income, (profile.income,))):
            score += 8
            _add_match(matches, "Income")

    if profile.landStatus and _has(text, "land", "agricultural land", "farmland", "cultivator"):
        score += 12
        _add_match(matches, "Land / agricultural status")

    if profile.businessStatus and _has(text, "business", "enterprise", "entrepreneur", "startup", "msme"):
        score += 12
        _add_match(matches, "Business status")

    if profile.businessType and _has(text, profile.businessType):
        score += 8
        _add_match(matches, "Business type")

    return (score, matches) if score > 0 else None


@router.post("")
def get_recommendations(profile: ProfileRequest):
    df = load_schemes()
    recommendations = []

    for _, row in df.iterrows():
        result = _score_profile(row, profile)
        if not result:
            continue

        score, matches = result
        recommendations.append({
            "scheme_name": str(row.get("scheme_name", "")),
            "slug": str(row.get("slug", "")),
            "details": str(row.get("details", "")),
            "benefits": str(row.get("benefits", "")),
            "eligibility": str(row.get("eligibility", "")),
            "level": str(row.get("level", "")),
            "schemeCategory": str(row.get("schemeCategory", "")),
            "tags": str(row.get("tags", "")),
            "relevance_score": score,
            "matched_profile_signals": matches,
        })

    recommendations.sort(key=lambda item: item["relevance_score"], reverse=True)

    return {
        "profile": profile.model_dump(),
        "recommendations": recommendations[:12],
        "disclaimer": "These are potentially relevant schemes based on profile signals found in the available scheme data. This does not determine or guarantee official eligibility.",
    }
