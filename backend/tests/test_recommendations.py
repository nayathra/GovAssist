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
    _detect_restricted_states,
    _eligibility_conflicts,
    _scheme_records,
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


    def test_resident_of_state_phrase_is_detected(self):
        row = {
            "scheme_name": "Mandi Worker Support",
            "details": "A scheme of the Rajasthan Government.",
            "benefits": "",
            "eligibility": "The applicant should be a permanent resident of Rajasthan.",
            "level": "State",
        }

        self.assertEqual(_detect_restricted_states(row), ("Rajasthan",))

    def test_puducherry_union_territory_phrase_is_detected(self):
        row = {
            "scheme_name": "Fishing Assistance",
            "details": "A scheme for Puducherry fishermen.",
            "benefits": "",
            "eligibility": "The applicant should be an ordinarily resident of the Union territory of Puducherry.",
            "level": "State",
        }

        self.assertEqual(_detect_restricted_states(row), ("Puducherry",))

    def test_state_level_scheme_with_unknown_coverage_produces_warning(self):
        profile = ProfileRequest(state="Kerala", occupation="Student")
        row = make_row(
            text="student support for eligible applicants",
            eligibility="Students may apply.",
        )
        row["level"] = "State"

        conflicts, warnings = _eligibility_conflicts(row, profile)

        self.assertEqual(conflicts, [])
        self.assertTrue(any("state/UT coverage could not be confirmed" in item for item in warnings))

    def test_owned_land_conflicts_with_landless_requirement(self):
        profile = ProfileRequest(
            occupation="Farmer",
            state="Maharashtra",
            landStatus="Own agricultural land",
        )
        row = make_row(
            text="financial assistance for landless agricultural workers",
            eligibility="The applicant must be a landless labourer. The applicant's family should not own any agricultural land.",
            restricted_states=("Maharashtra",),
        )

        self.assertIsNone(_score_profile(row, profile))

    def test_age_range_excludes_applicant_above_maximum(self):
        profile = ProfileRequest(age="67", gender="Female", maritalStatus="Widowed")
        row = make_row(
            text="financial assistance for widowed applicants",
            eligibility="Women belonging to the age group of 18 to 50 years are eligible.",
        )

        self.assertIsNone(_score_profile(row, profile))

    def test_age_range_allows_applicant_within_range(self):
        profile = ProfileRequest(age="35", gender="Female", maritalStatus="Widowed")
        row = make_row(
            text="financial assistance for widowed applicants",
            eligibility="Women belonging to the age group of 18 to 50 years are eligible.",
        )

        self.assertIsNotNone(_score_profile(row, profile))

    def test_specific_social_category_mismatch_is_excluded(self):
        profile = ProfileRequest(socialCategory="OBC", occupation="Student")
        row = make_row(
            text="scholarship for students",
            eligibility="The beneficiary should belong to the Adi Dravidar/Tribal community.",
        )

        self.assertIsNone(_score_profile(row, profile))

    def test_income_band_overlapping_ceiling_is_warned(self):
        profile = ProfileRequest(income="₹1 Lakh – ₹2.5 Lakh")
        row = make_row(
            text="financial support for eligible households",
            eligibility="The annual family income should not exceed Rs. 2 lakh.",
        )

        conflicts, warnings = _eligibility_conflicts(row, profile)

        self.assertEqual(conflicts, [])
        self.assertTrue(any("overlaps the stated income limit" in item for item in warnings))

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


class UploadedDatasetIntegrationTests(unittest.TestCase):
    """Check known failure cases against the repository's real 3,400-row CSV."""

    @classmethod
    def setUpClass(cls):
        _scheme_records.cache_clear()
        cls.records = {
            row["scheme_name"]: row
            for row in _scheme_records()
        }

    @classmethod
    def tearDownClass(cls):
        _scheme_records.cache_clear()

    def test_kerala_profile_is_not_matched_to_other_state_schemes(self):
        profile = ProfileRequest(
            age="67",
            gender="Male",
            state="Kerala",
            occupation="Retired / Senior Citizen",
            education="School",
            employmentStatus="Retired",
            studentStatus="No",
            income="Below ₹1 Lakh",
            socialCategory="General",
            maritalStatus="Widowed",
            disabilityStatus="No",
            residence="Rural",
        )
        wrong_state_schemes = (
            "Mahatma Jyotiba Phule Mandi shramik kalyaan yojana",
            '"Fishing Ban Period Assistance" under "Welfare and Relief for Fishermen During Lean Seasons and Natural Calamities Scheme"',
            "Lakshmir Bhandar Scheme",
        )

        for scheme_name in wrong_state_schemes:
            with self.subTest(scheme=scheme_name):
                self.assertIn(scheme_name, self.records)
                self.assertIsNone(_score_profile(self.records[scheme_name], profile))

    def test_land_owning_maharashtra_farmer_is_not_matched_to_landless_scheme(self):
        profile = ProfileRequest(
            age="42",
            gender="Male",
            state="Maharashtra",
            occupation="Farmer",
            education="School",
            employmentStatus="Self-Employed",
            studentStatus="No",
            income="₹1 Lakh – ₹2.5 Lakh",
            socialCategory="OBC",
            maritalStatus="Married",
            disabilityStatus="No",
            residence="Rural",
            landStatus="Own agricultural land",
        )
        scheme_name = "Aam Aadmi Bima Yojana (Maharashtra)"

        self.assertIn(scheme_name, self.records)
        self.assertIsNone(_score_profile(self.records[scheme_name], profile))

    def test_senior_applicant_is_not_matched_to_18_to_50_scheme(self):
        profile = ProfileRequest(
            age="67",
            gender="Female",
            state="Kerala",
            occupation="Retired / Senior Citizen",
            employmentStatus="Retired",
            studentStatus="No",
            socialCategory="General",
            maritalStatus="Widowed",
            disabilityStatus="No",
        )
        scheme_name = "Mangalya Scheme For Widow Remarriage"

        self.assertIn(scheme_name, self.records)
        self.assertIsNone(_score_profile(self.records[scheme_name], profile))

    def test_obc_student_is_not_matched_to_adi_dravidar_tribal_only_scheme(self):
        profile = ProfileRequest(
            age="16",
            gender="Female",
            state="Tamil Nadu",
            occupation="Student",
            education="Higher Secondary",
            employmentStatus="Student",
            studentStatus="Yes",
            income="Below ₹1 Lakh",
            socialCategory="OBC",
            maritalStatus="Single",
            disabilityStatus="No",
            residence="Rural",
        )
        scheme_name = "Admission of Adi Dravidar/Tribal Students in Plus One at Reputed Schools"

        self.assertIn(scheme_name, self.records)
        self.assertIsNone(_score_profile(self.records[scheme_name], profile))



if __name__ == "__main__":
    unittest.main()
