import datetime
from pydantic import BaseModel


class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "system"


class NotificationResponse(BaseModel):
    id: int
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

