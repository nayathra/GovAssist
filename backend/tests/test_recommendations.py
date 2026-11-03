"""Focused regression tests for recommendation matching.

Run from the repository root with:
    python -m unittest discover -s backend/tests
"""

import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.routes.recommendations import (  # noqa: E402
    ProfileRequest,
    _eligibility_conflicts,
    _score_profile,
)


def make_row(text="", eligibility="", restricted_states=()):
    return {
        "__text": text.lower(),
        "__eligibility": eligibility.lower(),
        "__restricted_states": restricted_states,
        "scheme_name": "Example Scheme",
        "slug": "example-scheme",
        "details": text,
        "benefits": "",
        "eligibility": eligibility,
        "level": "State" if restricted_states else "Central",
        "schemeCategory": "Test",
        "tags": "",
    }


class RecommendationMatchingTests(unittest.TestCase):
    def test_scheme_can_allow_multiple_states(self):
        profile = ProfileRequest(state="Tamil Nadu", occupation="Student")
        row = make_row(
            text="student scholarship for eligible applicants",
            eligibility="Applicants must be residents of Tamil Nadu or Kerala.",
            restricted_states=("Tamil Nadu", "Kerala"),
        )

        conflicts, _ = _eligibility_conflicts(row, profile)
        result = _score_profile(row, profile)

        self.assertEqual(conflicts, [])
        self.assertIsNotNone(result)
        self.assertIn("State", result[1])

    def test_scheme_restricted_to_another_state_is_excluded(self):
        profile = ProfileRequest(state="Tamil Nadu", occupation="Student")
        row = make_row(
            text="student scholarship for eligible applicants",
            eligibility="Applicants must be residents of Maharashtra.",
            restricted_states=("Maharashtra",),
        )

        self.assertIsNone(_score_profile(row, profile))

    def test_incidental_state_mention_does_not_add_state_match(self):
        profile = ProfileRequest(state="Tamil Nadu", occupation="Student")
        row = make_row(
            text="student scholarship with a programme office mentioned in Tamil Nadu",
            eligibility="Students may apply.",
        )

        result = _score_profile(row, profile)

        self.assertIsNotNone(result)
        self.assertNotIn("State", result[1])

    def test_generic_other_values_do_not_create_matches(self):
        profile = ProfileRequest(
            occupation="Other",
            education="Other",
            socialCategory="Other",
        )
        row = make_row(text="support for other beneficiaries and other categories")

        self.assertIsNone(_score_profile(row, profile))

    def test_no_land_answer_does_not_create_a_positive_land_match(self):
        profile = ProfileRequest(landStatus="No agricultural land")
        row = make_row(text="agricultural land, farmland and cultivator support")

        self.assertIsNone(_score_profile(row, profile))

    def test_prefer_not_to_say_business_status_does_not_create_a_match(self):
        profile = ProfileRequest(businessStatus="Prefer not to say")
        row = make_row(text="business, enterprise and startup support")

        self.assertIsNone(_score_profile(row, profile))

    def test_income_match_requires_an_explicit_eligibility_limit(self):
        profile = ProfileRequest(income="Below ₹1 Lakh")
        row = make_row(
            text="students below the age of 25 may receive scholarship information",
            eligibility="",
        )

        self.assertIsNone(_score_profile(row, profile))

    def test_income_match_is_awarded_when_profile_range_fits_stated_limit(self):
        profile = ProfileRequest(income="Below ₹1 Lakh")
        row = make_row(
            text="financial support for eligible households",
            eligibility="Annual family income should not exceed Rs. 2 lakh.",
        )

        result = _score_profile(row, profile)

        self.assertIsNotNone(result)
        self.assertIn("Income", result[1])

    def test_income_range_above_limit_is_excluded(self):
        profile = ProfileRequest(income="Above ₹10 Lakh")
        row = make_row(
            text="financial support for eligible households",
            eligibility="Annual family income should not exceed Rs. 2 lakh.",
        )

        self.assertIsNone(_score_profile(row, profile))


if __name__ == "__main__":
    unittest.main()
