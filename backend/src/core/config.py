"""Application configuration."""

from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str
    ANTHROPIC_API_KEY: Optional[str] = None
    APP_ENV: str = "development"
    DB_POOL_MIN_SIZE: int = 1
    DB_POOL_MAX_SIZE: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
