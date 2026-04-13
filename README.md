# PeakMind

PeakMind is a .NET 10 Minimal API project organized with a vertical-slice architecture. It uses MediatR for request handling, FluentValidation for input validation, and EF Core (Npgsql) with ASP.NET Core Identity for authentication (JWT tokens).

Repository layout (relevant parts)
- backend/ — .NET 10 API (Identity, EF Core, MediatR, FluentValidation)
- frontend/ — (optional) frontend app
- docker-compose.yml — local Docker services (postgres, backend, frontend)

Prerequisites
- .NET 10 SDK (dotnet --info)
- Docker Desktop (for Postgres container)
- dotnet-ef tool (optional for creating migrations locally):
  ```powershell
  dotnet tool install --global dotnet-ef
  ```

Local development using Docker (recommended)
1. Start Postgres container only (from repo root):
   ```powershell
   docker compose up -d postgres
   docker compose logs -f postgres
   ```
   Wait for the log entry: "database system is ready to accept connections".

2. Create migrations (if needed) from the host:
   ```powershell
   dotnet restore
   dotnet ef migrations add InitialCreate -p backend -s backend
   ```

3. Apply migrations to the running Postgres (host):
   ```powershell
   dotnet ef database update -p backend -s backend --connection "Host=localhost;Port=5432;Database=peakminddb;Username=peakmind;Password=peakmind_pass"
   ```

4. Start backend and frontend containers:
   ```powershell
   docker compose up -d backend frontend
   docker compose logs -f backend
   ```

Notes
- The docker-compose file sets Postgres credentials via environment variables. If you change credentials after the Postgres volume has been initialized, you must remove the volume to reinitialize the DB:
  ```powershell
  docker compose down -v
  docker compose up -d postgres
  ```
- The backend contains a startup routine that calls Database.Migrate() with retries so the app will attempt to apply migrations at container startup.

Configuration
- Edit `backend/appsettings.json` to set DefaultConnection and Jwt settings (Key, Issuer, Audience). Use a strong, secret Jwt:Key in production.

Authentication endpoints
- POST /auth/register — register a new user (email, password, name)
- POST /auth/login — returns a JWT token

Migrations
- The initial migration has been generated and is located under `backend/Migrations`.

Development tips
- Open the solution in Visual Studio 2026, restore NuGet packages, build, and run.
- If you need an admin user seeded at startup, I can add a simple seeder service.

Support
- Ask for changes: create a seeder, add refresh tokens, or produce a Postman collection.

License: MIT

