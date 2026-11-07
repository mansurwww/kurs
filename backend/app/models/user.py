import datetime
from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class User(Base):
    """
    Keycloak-пен синхрондалған пайдаланушы профилінің кестесі.
    """
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # Keycloak sub (UUID)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    role: Mapped[str] = mapped_column(String(50), default="student", index=True)  # student, teacher, admin
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.utcnow
    )

