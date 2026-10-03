FROM python:3.12-slim

LABEL com.azure.containerizationassist.createdby="containerization-assist"

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
# ENV TODO_DB_CONNECTION_STRING=<set at runtime>

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl gnupg unixodbc && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/microsoft-prod.list && apt-get update && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --uid 10001 appuser

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=10001:10001 backend/main.py backend/db.py backend/init_db.py ./
COPY --chown=10001:10001 database/schema.sql ./database/schema.sql

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD ["python", "-c", "from urllib.request import urlopen; urlopen('http://127.0.0.1:8000/health', timeout=3)"]
USER appuser
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]