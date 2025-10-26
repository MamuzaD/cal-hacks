"""Application lifespan management."""

from contextlib import asynccontextmanager
from src.db.pool import init_pool, close_pool


@asynccontextmanager
async def lifespan(app):
    """Manage application lifespan - initialize and cleanup resources."""
    await init_pool()
    yield
    await close_pool()
