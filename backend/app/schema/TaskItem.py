from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class TaskItemRequest(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    priority: Optional[str] = "medium"
    due_date: Optional[date] = None

class TaskItemResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    is_completed: bool
    priority: Optional[str] = "medium"
    due_date: Optional[date] = None
    created_at : datetime 

    model_config = ConfigDict(from_attributes=True)
    