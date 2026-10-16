from fastapi import APIRouter, Depends, HTTPException
from app.config.sql_config import get_session
from app.models.TaskItem import TaskItem
from sqlalchemy.orm import Session
from app.schema.TaskItem import TaskItemRequest,TaskItemResponse
from fastapi.responses import JSONResponse
from uuid import UUID

router = APIRouter()

@router.get("/",  response_model= list[TaskItemResponse])
def get_task_items(db: Session = Depends(get_session)):
    task_items = db.query(TaskItem).all()
    return task_items

@router.post("/", response_model= TaskItemResponse)
def create_task_item(item : TaskItemRequest , db: Session = Depends(get_session)):
    task_item = TaskItem(**item.model_dump())
    db.add(task_item)
    db.commit()
    db.refresh(task_item)
    return task_item

@router.delete("/{id}")
def delete_task_item(id : UUID , db: Session = Depends(get_session)):
    db_task_item = db.query(TaskItem).get(id)
    if not db_task_item:
        raise HTTPException(status_code=404, detail="Task item Not Found.")
    
    db.delete(db_task_item)
    db.commit()
    
    return JSONResponse(status_code=200, content={"message":"Task item deleted successfully."})


@router.put("/{id}", response_model=TaskItemResponse)
def update_task_item(id: UUID, item : TaskItemRequest, db: Session = Depends(get_session)):
    db_task_item = db.query(TaskItem).get(id)
    if not db_task_item:
        raise HTTPException(status_code=404, detail="Task item Not Found.")
    
    db_task_item.title = item.title
    db_task_item.description = item.description
    db_task_item.is_completed = item.is_completed
    if item.priority is not None:
        db_task_item.priority = item.priority
    db_task_item.due_date = item.due_date
    
    db.commit()
    db.refresh(db_task_item)
    
    return db_task_item
    
        
    
    