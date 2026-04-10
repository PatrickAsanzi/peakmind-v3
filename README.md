# MVP-Template

A reusable full-stack monorepo starter for .NET 8 backend and React + Vite + TypeScript frontend.

## Structure

- `backend` - .NET 8 Web API starter
- `frontend` - React Vite TypeScript starter
- `docker-compose.yml` - local compose setup for both services

## Backend

```powershell
cd backend
dotnet restore
dotnet build
dotnet run
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite app at `http://localhost:5173`.

## Docker Compose

```powershell
docker compose up --build
```

- frontend: `http://localhost:3000`
- backend: `http://localhost:5000`
