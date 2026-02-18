# 01Blog

Simple school project: Angular frontend + Spring Boot backend.

## Folders
- `frontend` UI
- `backend` API

## Requirements
- Node.js + npm
- Java 17
- PostgreSQL

## Quick Start (Local)
1. Start backend:
```bash
cd backend
export JWT_SECRET='QmxvZ0RldkNvbXBvc2VTZWNyZXRLZXlGb3JMb2NhbE9ubHkhIQ=='
export APP_AUTH_COOKIE_SECURE=false
export SPRING_SQL_INIT_MODE=always
./mvnw spring-boot:run
```

2. Start frontend:
```bash
cd frontend
npm install
npm start
```

## URLs
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`
- API base: `http://localhost:8080/api`

## Optional (Docker)
```bash
docker compose up --build
```
