"""Database connection pooling."""

import asyncpg
import logging
from src.core.config import settings

logger = logging.getLogger(__name__)

_db_pool = None


async def init_pool():
    """Initialize the database connection pool."""
    global _db_pool
    if not _db_pool:
        _db_pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=settings.DB_POOL_MIN_SIZE,
            max_size=settings.DB_POOL_MAX_SIZE,
        )
        logger.info("Database pool initialized")


async def close_pool():
    """Close the database connection pool."""
    global _db_pool
    if _db_pool:
        await _db_pool.close()
        _db_pool = None
        logger.info("Database pool closed")


async def get_db():
    """Get a database connection from the pool."""
    global _db_pool
    async with _db_pool.acquire() as conn:
        yield conn
