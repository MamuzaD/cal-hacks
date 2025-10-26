"""Fallback heuristics for entity classification when AI is unavailable."""

import re
from typing import Dict, Any


def simple_classify(term: str) -> Dict[str, Any]:
    """
    Classify search term as person or company using improved heuristics.

    Args:
        term: Search term to classify

    Returns:
        dict with 'type', 'confidence', and 'reasoning'
    """
    t = term.strip()
    t_lower = t.lower()
    words = [w for w in t.split() if w]

    # Check for ticker-like patterns (1-5 uppercase letters, possibly with dots)
    if re.match(r"^[A-Z]{1,5}(\.)?$", t):
        return {
            "type": "company",
            "confidence": 0.7,
            "reasoning": "Uppercase pattern matches stock ticker format",
        }

    # Check for company suffixes
    company_suffixes = [
        "inc",
        "corporation",
        "corp",
        "llc",
        "ltd",
        "limited",
        "group",
        "systems",
        "labs",
        "co.",
        "company",
        "technologies",
        "tech",
        "ventures",
        "capital",
        "partners",
        "holdings",
    ]
    if any(t_lower.endswith(suffix) for suffix in company_suffixes):
        return {
            "type": "company",
            "confidence": 0.75,
            "reasoning": "Contains typical company suffix",
        }

    # Check for multiple capitals (common in company names)
    # e.g., "Starbucks", "McDonalds", "NYSE"
    if re.match(r".*[A-Z].*[A-Z].*", t) and not re.match(
        r"^[A-Z][a-z]+ [A-Z][a-z]+$", t
    ):
        # Multiple capitals but not typical "FirstName LastName" pattern
        return {
            "type": "company",
            "confidence": 0.65,
            "reasoning": "Multiple capital letters suggest company branding",
        }

    # Person detection: 2-4 words with proper capitalization
    if 2 <= len(words) <= 4:
        # Check if words are primarily capitalized (person name)
        proper_caps = sum(1 for w in words if w and w[0].isupper())

        if proper_caps >= len(words) * 0.8:  # Most words are capitalized
            # Check for title prefixes
            titles = [
                "mr",
                "mrs",
                "ms",
                "dr",
                "prof",
                "sen",
                "rep",
                "gov",
                "pres",
                "vice",
            ]
            if words[0].lower() in titles:
                return {
                    "type": "person",
                    "confidence": 0.85,
                    "reasoning": "Title prefix detected",
                }

            # Check for common person indicators
            if re.match(r"^[A-Z][a-z]+ [A-Z]\.? [A-Z][a-z]+$", t):  # John M. Doe
                return {
                    "type": "person",
                    "confidence": 0.8,
                    "reasoning": "Middle initial pattern typical of person names",
                }

            # 2-3 word capitalized names
            if 2 <= len(words) <= 3:
                return {
                    "type": "person",
                    "confidence": 0.7,
                    "reasoning": "Proper capitalization suggests person name",
                }

    # Check for political positions/roles (indicators of politicians)
    political_keywords = [
        "senator",
        "sen.",
        "representative",
        "rep.",
        "governor",
        "gov.",
        "mayor",
        "congressman",
        "congresswoman",
        "representative",
        "president",
        "vice president",
        "secretary",
        "attorney general",
        "assemblyman",
    ]
    if any(keyword in t_lower for keyword in political_keywords):
        return {
            "type": "person",
            "confidence": 0.8,
            "reasoning": "Contains political position keyword",
        }

    # Check for age indicators (person)
    if re.search(r"\d{1,2}\s*(years old|yr old|yrs old)", t_lower):
        return {
            "type": "person",
            "confidence": 0.75,
            "reasoning": "Age indicator suggests person",
        }

    # Default: check for generic indicators
    if "committee" in t_lower or "foundation" in t_lower or "fund" in t_lower:
        return {
            "type": "company",
            "confidence": 0.6,
            "reasoning": "Contains organization indicator",
        }

    # Default assumption
    return {
        "type": "company",
        "confidence": 0.5,
        "reasoning": "Default assumption: company",
    }
