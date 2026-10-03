# Daymark Todo App

A small todo app with a React frontend, FastAPI backend, and SQL Server Express database. The API uses parameterized SQL through `pyodbc`; there is no ORM.

## Requirements

- Node.js and npm
- Python 3.10 or newer
- SQL Server Express LocalDB and SQL Server Management Studio (or another SQL client)
- Microsoft ODBC Driver 17 or newer for SQL Server

## Database setup

In SQL Server Management Studio, connect to `(localdb)\MSSQLLocalDB` and run:

```sql
CREATE DATABASE TodoDb;
GO
```

Select `TodoDb`, then run the contents of `database/schema.sql` to create the `Todos` table. This project has been configured to use the per-user LocalDB instance with Windows authentication.

## Start the API

Open PowerShell in the project folder and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload --env-file .env
```

The connection string is stored in the ignored `backend/.env` file. Change its server or database values if you use a different SQL Server instance.

The API and interactive docs will be available at `http://localhost:8000` and `http://localhost:8000/docs`.

## Start the frontend

In a second terminal, from the project folder:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The page can add, list, edit, complete, and delete todos.

## Run with Docker Desktop

The Compose setup runs the frontend, API, and SQL Server Express in containers. Its SQL Server database is separate from a LocalDB instance used for running the API directly.

1. Copy `.env.example` to `.env` and set `MSSQL_SA_PASSWORD` to a strong password (at least eight characters with uppercase, lowercase, a number, and a symbol). The root `.env` is ignored by Git.
2. In Docker Desktop, use Linux containers and allocate at least 2 GB of memory to SQL Server.
3. From the project folder, start the app:

	```powershell
	docker compose up --build -d
	```

Open `http://localhost:5173`. The API is at `http://localhost:8000` and SQL Server is available on `localhost,1433`. Compose waits for SQL Server to become healthy, creates `TodoDb` and the `Todos` table, then starts the API and frontend.

Use `docker compose ps` to check service health and `docker compose logs -f` to view logs. `docker compose down` stops the app but keeps the SQL data in its named volume. `docker compose down -v` also deletes that database volume.