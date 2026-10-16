from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Uuid, DateTime, String, Boolean, Date
import uuid
from sqlalchemy.sql import func

Base = declarative_base()

class TaskItem(Base):
    __tablename__ = 'task_items'
    
    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    title =  Column(String(100), nullable=False, index=True)
    description =  Column(String(255), nullable=True) 
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default='medium')
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

