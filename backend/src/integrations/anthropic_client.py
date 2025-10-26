"""Anthropic Claude client integration."""

import anthropic
import logging
from src.core.config import settings

logger = logging.getLogger(__name__)


def get_anthropic():
    """Get Anthropic client if API key is configured."""
    if not settings.ANTHROPIC_API_KEY:
        return None
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
