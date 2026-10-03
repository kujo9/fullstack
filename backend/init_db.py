import os
from contextlib import closing
from pathlib import Path

import pyodbc


connection_string = os.environ["TODO_DB_CONNECTION_STRING"]
master_connection_string = connection_string.replace(
    "DATABASE=TodoDb;",
    "DATABASE=master;",
)

with closing(pyodbc.connect(master_connection_string, autocommit=True)) as connection:
    cursor = connection.cursor()
    cursor.execute("IF DB_ID(N'TodoDb') IS NULL CREATE DATABASE TodoDb")

schema = (Path(__file__).parent / "database" / "schema.sql").read_text()
with closing(pyodbc.connect(connection_string)) as connection:
    connection.cursor().execute(schema)
    connection.commit()