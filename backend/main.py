from datetime import datetime

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import db


class TodoInput(BaseModel):
    Title: str = Field(min_length=1, max_length=200)
    Description: str | None = None


class TodoUpdate(TodoInput):
    IsCompleted: bool | None = None


class Todo(TodoInput):
    Id: int
    DateCreated: datetime
    IsCompleted: bool


app = FastAPI(title="Simple Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/todos", response_model=list[Todo])
def list_todos():
    return db.get_todos()


@app.post("/todos", response_model=Todo, status_code=status.HTTP_201_CREATED)
def add_todo(todo: TodoInput):
    return db.create_todo(todo.Title, todo.Description)


@app.put("/todos/{todo_id}", response_model=Todo)
def edit_todo(todo_id: int, todo: TodoUpdate):
    updated_todo = db.update_todo(
        todo_id,
        todo.Title,
        todo.Description,
        todo.IsCompleted,
    )
    if updated_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_todo(todo_id: int):
    if not db.delete_todo(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)