from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    OLLAMA_MODEL: str = "llama3.2"
    QUEUE_NAME: str = "edu_ai_tasks"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

