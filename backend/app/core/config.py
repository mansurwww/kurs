from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field


class Settings(BaseSettings):
    PROJECT_NAME: str = "Education Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # PostgreSQL Database
    POSTGRES_SERVER: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "edu_db"

    @computed_field
    @property
    def ASYNC_DATABASE_URI(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # Keycloak OIDC
    KEYCLOAK_SERVER_URL: str = "http://keycloak:8080"
    KEYCLOAK_REALM: str = "edu-realm"
    KEYCLOAK_CLIENT_ID: str = "edu-client"
    KEYCLOAK_CLIENT_SECRET: str = ""

    # Ollama Local LLM
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    OLLAMA_DEFAULT_MODEL: str = "llama3.2"

    # Redis Cache
    REDIS_URL: str = "redis://redis:6379/0"

    # RabbitMQ Broker
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

