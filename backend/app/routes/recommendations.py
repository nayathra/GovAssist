import re
from functools import lru_cache
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
    return row.get("__text") or ""


def _eligibility_text(row) -> str:
    return row.get("__eligibility") or ""


@lru_cache(maxsize=1)
def _scheme_records() -> tuple[dict, ...]:
    """Prepare the scheme index once for fast recommendation requests."""
    df = load_schemes()
    fields = [
        "scheme_name", "details", "benefits", "eligibility",
        "application", "documents", "tags", "schemeCategory", "level",
    ]
    indian_states = (
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
        "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal",
    )
    records = []
    for row in df.to_dict("records"):
        record = dict(row)
        record["__text"] = " ".join(
            str(record.get(field, "")) for field in fields
        ).lower()
        record["__eligibility"] = str(record.get("eligibility", "")).lower()

        restricted_states = []
        eligibility = record["__eligibility"]
        context = " ".join(
            str(record.get(field, ""))
            for field in ("scheme_name", "details", "benefits")
        ).lower()

        for state_name in indian_states:
            state_lower = state_name.lower()
            direct_patterns = (
                rf"resid(?:ing|ence)\s+(?:in|of)\s+{re.escape(state_lower)}",
                rf"domicile\s+(?:of|in)\s+{re.escape(state_lower)}",
                rf"native\s+(?:of|to)\s+{re.escape(state_lower)}",
                rf"state\s+of\s+{re.escape(state_lower)}",
                rf"from\s+the\s+state\s+of\s+{re.escape(state_lower)}",
            )
            state_patterns = (
                rf"government\s+of\s+{re.escape(state_lower)}",
                rf"govt\.?\s+of\s+{re.escape(state_lower)}",
                rf"department[^.]{0,100}\b{re.escape(state_lower)}\b",
                rf"government\s+of\s+{re.escape(state_lower.split()[0])}\b",
            )
            if any(re.search(pattern, eligibility) for pattern in direct_patterns):
                restricted_states.append(state_name)
            if str(record.get("level", "")).strip().lower() == "state" and any(
                re.search(pattern, context) for pattern in state_patterns
            ):
                restricted_states.append(state_name)

        record["__restricted_states"] = tuple(dict.fromkeys(restricted_states))
        records.append(record)

    return tuple(records)


def _has(text: str, *values: str) -> bool:
    return any(value.lower() in text for value in values if value)


def _has_word(text: str, *values: str) -> bool:
    return any(re.search(rf"\b{re.escape(value.lower())}\b", text) for value in values if value)


def _add_match(matches: list[str], label: str) -> None:
    if label not in matches:
        matches.append(label)


def _parse_money(value: str) -> Optional[float]:
    value = value.lower().replace(",", "").replace("₹", "").strip()
    match = re.search(r"(\d+(?:\.\d+)?)\s*(lakh|lakhs|crore|crores)?", value)
    if not match:
        return None

    amount = float(match.group(1))
    unit = match.group(2) or ""
    if unit.startswith("lakh"):
        return amount * 100_000
    if unit.startswith("crore"):
        return amount * 10_000_000
    return amount


def _profile_income_bounds(income: str) -> Optional[tuple[float, float]]:
    ranges = {
        "Below ₹1 Lakh": (0, 100_000),
        "₹1 Lakh – ₹2.5 Lakh": (100_000, 250_000),
        "₹2.5 Lakh – ₹5 Lakh": (250_000, 500_000),
        "₹5 Lakh – ₹10 Lakh": (500_000, 1_000_000),
        "Above ₹10 Lakh": (1_000_000, float("inf")),
    }
    return ranges.get(income)


def _eligibility_conflicts(row, profile: ProfileRequest) -> tuple[list[str], list[str]]:
    """
    Return hard conflicts that make a scheme unsuitable for the supplied
    profile, plus softer warnings where the available profile data is not
    enough to confirm a requirement.

    Unknown conditions remain unknown rather than being treated as satisfied.
    """
    eligibility = _eligibility_text(row)
    conflicts: list[str] = []
    warnings: list[str] = []

    # Explicit gender restrictions.
    if profile.gender == "Female" and (
        _has_word(eligibility, "male only")
        or _has(eligibility, "only for men", "only for males", "for men only", "for males only")
    ):
        conflicts.append("Eligibility appears restricted to males/men.")
    if profile.gender == "Male" and (
        _has_word(eligibility, "female only")
        or _has(eligibility, "only for women", "only for females", "for women only", "for females only")
    ):
        conflicts.append("Eligibility appears restricted to females/women.")

    # Explicit state/residence restrictions.
    if profile.state and profile.state != "Other / All India":
        normalized_profile_state = profile.state.lower().strip()
        restricted_states = [
            state for state in row.get("__restricted_states", ())
            if state.lower() != normalized_profile_state
        ]
        if restricted_states:
            conflicts.append(
                f"The scheme appears restricted to {restricted_states[0]}, not {profile.state}."
            )

    # Explicit age thresholds.
    if profile.age:
        try:
            age = int(profile.age)
        except ValueError:
            age = -1

        if age >= 0:
            max_age_patterns = [
                r"(?:below|under|less than|up to|not more than|maximum(?: age)? of)\s*(\d{1,3})\s*(?:years?|yrs?)?",
                r"age\s*(?:should be|must be|is)?\s*(?:below|under|up to)\s*(\d{1,3})",
            ]
            for pattern in max_age_patterns:
                for match in re.finditer(pattern, eligibility):
                    maximum = int(match.group(1))
                    if age > maximum:
                        conflicts.append(f"Profile age {age} is above the stated maximum age of {maximum}.")

            min_age_patterns = [
                r"(?:above|over|at least|minimum(?: age)? of)\s*(\d{1,3})\s*(?:years?|yrs?)?",
                r"age\s*(?:should be|must be|is)?\s*(?:above|over)\s*(\d{1,3})",
                r"age\s*(?:should be|must be|is)\s*(\d{1,3})\s*(?:years?|yrs?)?\s*(?:and above|or above|and over|or over)",
                r"(?:applicant|beneficiary)[^.;]{0,40}?age\s*(?:should be|must be|is)\s*(\d{1,3})\s*(?:years?|yrs?)?\s*(?:and above|or above|and over|or over)",
            ]
            for pattern in min_age_patterns:
                for match in re.finditer(pattern, eligibility):
                    minimum = int(match.group(1))
                    if age < minimum:
                        conflicts.append(f"Profile age {age} is below the stated minimum age of {minimum}.")

            if age >= 18 and _has(eligibility, "girl child", "boy child", "child beneficiary"):
                warnings.append(
                    "The eligibility mentions a child-related condition; the available profile does not establish the scheme's exact definition of 'child'."
                )

    # Income thresholds.
    bounds = _profile_income_bounds(profile.income)
    if bounds:
        upper_patterns = [
            r"(?:annual|family|parental|household)?\s*(?:income|earnings)[^.;,]{0,80}?(?:not exceed|does not exceed|less than|below|under|up to|maximum of|<=|<)\s*(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|lakhs|crore|crores)?",
            r"(?:rs\.?|₹)?\s*([\d,.]+)\s*(lakh|lakhs|crore|crores)?\s*(?:or less|and below|per annum or less)",
        ]
        for pattern in upper_patterns:
            for match in re.finditer(pattern, eligibility):
                amount = _parse_money(f"{match.group(1)} {match.group(2) or ''}")
                if amount is not None and bounds[0] > amount:
                    conflicts.append(
                        f"The selected income range is entirely above the stated income limit of ₹{amount:,.0f}."
                    )

        if _has(eligibility, "income certificate", "annual income") and profile.income == "Below ₹1 Lakh":
            warnings.append(
                "The profile gives an income range; exact income thresholds in the scheme data may still need verification."
            )

    # Profile-known beneficiary restrictions. These should be hard conflicts
    # when the profile explicitly says the condition is not present.
    if profile.disabilityStatus == "No" and _has(
        eligibility,
        "persons with disabilities",
        "persons with disability",
        "disabled persons",
        "hearing impaired",
        "visually impaired",
        "visual impairment",
        "hearing impairment",
        "divyang",
    ):
        conflicts.append("The scheme appears intended for persons with disabilities, but the profile says disability is No.")

    if profile.maritalStatus and profile.maritalStatus != "Widowed" and _has(
        eligibility,
        "widow",
        "widows",
        "widowed",
    ):
        conflicts.append("The scheme appears restricted to widows/widowed applicants.")

    # Conditions that the current profile form cannot directly verify.
    if _has(eligibility, "destitute"):
        warnings.append(
            "The scheme mentions a destitute-status requirement; the current profile does not establish this condition."
        )
    if _has(eligibility, "fixed assets", "total assets", "movable and immovable assets"):
        warnings.append(
            "The scheme mentions an asset-value requirement; the current profile does not establish the applicant's asset value."
        )
    if _has(eligibility, "returned migrant", "return migrant", "migrant workers returned", "returned to tamil nadu"):
        warnings.append(
            "The scheme mentions a returned-migrant condition; the current profile does not establish this condition."
        )

    return list(dict.fromkeys(conflicts)), list(dict.fromkeys(warnings))


def _score_profile(row, profile: ProfileRequest) -> Optional[tuple[int, list[str], list[str]]]:
    text = _text(row)
    score = 0
    matches: list[str] = []

    conflicts, warnings = _eligibility_conflicts(row, profile)

    if conflicts:
        return None

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

    if profile.education and profile.education != "Prefer not to say" and _has_word(text, profile.education):
        score += 10
        _add_match(matches, "Education")

    if profile.gender and profile.gender not in {"Prefer not to say", "Transgender"} and _has_word(text, profile.gender):
        score += 10
        _add_match(matches, "Gender")

    if profile.socialCategory and profile.socialCategory not in {"Prefer not to say", "General"} and _has_word(
        text, profile.socialCategory
    ):
        score += 10
        _add_match(matches, "Social category")

    if profile.disabilityStatus == "Yes" and _has(
        text, "disability", "disabled", "divyang", "persons with disabilities"
    ):
        score += 12
        _add_match(matches, "Disability status")

    if profile.residence and profile.residence != "Prefer not to say" and _has_word(text, profile.residence):
        score += 8
        _add_match(matches, "Residence")

    if profile.maritalStatus and profile.maritalStatus != "Prefer not to say":
        marital_terms = tuple(part.strip() for part in profile.maritalStatus.split(" / ") if part.strip())
        if _has_word(text, *marital_terms):
            score += 8
            _add_match(matches, "Marital status")

    if profile.employmentStatus and profile.employmentStatus not in {"Other", ""}:
        if _has_word(text, profile.employmentStatus):
            score += 8
            _add_match(matches, "Employment status")

    if profile.age:
        try:
            age = int(profile.age)
            if (
                (age < 18 and _has(text, "below 18", "minor"))
                or (18 <= age <= 25 and _has(text, "youth", "young"))
                or (26 <= age <= 40 and _has(text, "young adult", "working age"))
                or (age >= 60 and _has(text, "60", "senior citizen", "elderly", "old age"))
            ):
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

    if profile.businessType and _has_word(text, profile.businessType):
        score += 8
        _add_match(matches, "Business type")

    return (score, matches, warnings) if score > 0 else None


@router.post("")
def get_recommendations(profile: ProfileRequest):
    recommendations = []

    for row in _scheme_records():
        result = _score_profile(row, profile)
        if not result:
            continue

        score, matches, warnings = result
        recommendations.append(
            {
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
                "eligibility_warnings": warnings,
            }
        )

    recommendations.sort(
        key=lambda item: (item["relevance_score"], -len(item["eligibility_warnings"])),
        reverse=True,
    )

    # Prefer schemes whose known eligibility conditions do not contain
    # unresolved profile requirements. If enough clean matches exist, don't
    # fill the top results with schemes that require a condition the profile
    # form cannot establish (e.g. returned-migrant or destitute status).
    clean_recommendations = [
        item for item in recommendations if not item["eligibility_warnings"]
    ]

    if len(clean_recommendations) >= 3:
        recommendations = clean_recommendations

    return {
        "profile": profile.model_dump(),
        "recommendations": recommendations[:12],
        "disclaimer": "These are potentially relevant schemes based on profile signals found in the available scheme data. This does not determine or guarantee official eligibility.",
    }
