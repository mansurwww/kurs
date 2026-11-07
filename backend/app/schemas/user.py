from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    role: str = "student"


class UserResponse(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True

