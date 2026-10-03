import os
from contextlib import closing

import pyodbc


def get_connection():
    return pyodbc.connect(os.environ["TODO_DB_CONNECTION_STRING"])


def row_to_todo(row):
    return {
        "Id": row.Id,
        "Title": row.Title,
        "Description": row.Description,
        "DateCreated": row.DateCreated,
        "IsCompleted": bool(row.IsCompleted),
    }


def get_todos():
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT Id, Title, Description, DateCreated, IsCompleted "
            "FROM Todos ORDER BY DateCreated DESC, Id DESC"
        )
        return [row_to_todo(row) for row in cursor.fetchall()]


def create_todo(title, description):
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO Todos (Title, Description) "
            "OUTPUT INSERTED.Id, INSERTED.Title, INSERTED.Description, "
            "INSERTED.DateCreated, INSERTED.IsCompleted "
            "VALUES (?, ?)",
            title,
            description,
        )
        todo = row_to_todo(cursor.fetchone())
        connection.commit()
        return todo


def update_todo(todo_id, title, description, is_completed):
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE Todos SET Title = ?, Description = ?, "
            "IsCompleted = COALESCE(?, IsCompleted) "
            "OUTPUT INSERTED.Id, INSERTED.Title, INSERTED.Description, "
            "INSERTED.DateCreated, INSERTED.IsCompleted "
            "WHERE Id = ?",
            title,
            description,
            is_completed,
            todo_id,
        )
        row = cursor.fetchone()
        connection.commit()
        return row_to_todo(row) if row else None


def delete_todo(todo_id):
    with closing(get_connection()) as connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM Todos WHERE Id = ?", todo_id)
        deleted = cursor.rowcount > 0
        connection.commit()
        return deleted