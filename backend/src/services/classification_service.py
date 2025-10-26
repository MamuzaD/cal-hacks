"""Entity classification service using AI."""

import json
import logging
from src.integrations.anthropic_client import get_anthropic
from src.utils.nlp_fallbacks import simple_classify

logger = logging.getLogger(__name__)


async def classify_search_term(search_term: str) -> dict:
    """
    Classify a search term as person or company using Anthropic Claude.

    Falls back to heuristic classification if AI is unavailable.

    Args:
        search_term: The term to classify

    Returns:
        dict with 'type' ('person' or 'company'), 'confidence', 'reasoning'
    """
    client = get_anthropic()
    if not client:
        return simple_classify(search_term)

    prompt = f"""
Analyze this search term and determine if it refers to a PERSON (politician/individual) or a COMPANY (corporation/organization).

Search term: "{search_term}"

Consider:
- Person names typically have 2-3 words (first, middle, last name)
- Company names often include words like "Inc", "Corp", "LLC", "Group", "Systems", etc.
- Stock tickers are usually 3-5 uppercase letters
- Political figures often have titles or are known by partial names

Respond with valid JSON only:
{{
    "type": "person" or "company",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation of your decision"
}}
"""

    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}],
        )

        result = json.loads(response.content[0].text)

        # Validate response
        if result.get("type") not in ("person", "company"):
            raise ValueError("Invalid type from Claude")
        if not isinstance(result.get("confidence"), (int, float)):
            raise ValueError("Invalid confidence from Claude")

        return result

    except Exception as e:
        logger.warning(f"Claude classification failed: {e}")
        return simple_classify(search_term)
