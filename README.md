# PeakMind

PeakMind is a .NET 10 Minimal API project organized with a vertical-slice architecture. It uses MediatR for request handling, FluentValidation for input validation, and EF Core (Npgsql) with ASP.NET Core Identity for JWT-based authentication.

---

## Repository Layout

```
backend/          .NET 10 API (Identity, EF Core, MediatR, FluentValidation)
frontend/         React + Vite frontend
docker-compose.yml                base Docker services (postgres, backend, frontend)
docker-compose.override.yml       dev overrides (hot reload, vsdbg, source mounts)
```

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) — verify with `dotnet --info`
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- `dotnet-ef` tool (only needed if creating migrations locally):
  ```powershell
  dotnet tool install --global dotnet-ef
  ```

---

## Running the Dev Stack

Start the full stack from the repo root:

```powershell
docker compose -f docker-compose.yml -f docker-compose.override.yml up --build -d
```

The services are exposed at:

| Service  | URL / Address         |
| -------- | --------------------- |
| Frontend | http://localhost:4173 |
| Backend  | http://localhost:5000 |
| Postgres | localhost:5432        |

The backend runs in `dotnet watch` mode so code changes reload automatically without restarting the container.

To stop the stack:

```powershell
docker compose -f docker-compose.yml -f docker-compose.override.yml down
```

---

## Migrations

The initial migration is already generated under `backend/Migrations`. The backend calls `Database.Migrate()` with retries at startup so migrations are applied automatically when the container starts.

To create a new migration locally (requires Postgres running):

```powershell
# 1. Start only Postgres
docker compose up -d postgres

# 2. Create the migration
dotnet ef migrations add <MigrationName> -p backend -s backend

# 3. Apply it manually if needed (migrations also run automatically on startup)
dotnet ef database update -p backend -s backend \
  --connection "Host=localhost;Port=5432;Database=peakminddb;Username=peakmind;Password=peakmind_pass"
```

To reset the database and volume:

```powershell
docker compose down -v
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d postgres
```

> **Note:** If you change Postgres credentials after the volume has been initialized you must remove the volume using the commands above to reinitialize the DB.

---

## Debugging (VS Code)

Full stack debugging is supported for both the frontend and backend simultaneously using VS Code.

### Prerequisites

Make sure you have these VS Code extensions installed:

- **C# Dev Kit** — `ms-dotnettools.csdevkit`
- **Docker** — `ms-azuretools.vscode-docker`
- **JavaScript Debugger** — built in, confirm it is not disabled

### Steps

1. Start the stack (see above) and confirm all three containers are running:

   ```powershell
   docker ps
   ```

2. Set breakpoints in any `.cs` file for the backend or any `.tsx` / `.ts` file for the frontend.

3. Open the **Run and Debug** panel (`Ctrl+Shift+D`), select **Full Stack Debug** from the dropdown, and hit **F5**.

4. When the process picker appears for the backend select the process matching:

   ```
   /app/bin/Debug/net10.0/backend
   ```

   Do not select the `dotnet watch` or `VBCSCompiler` processes.

5. Chrome will open automatically at `http://localhost:4173`.

### Stopping

Hit `Shift+F5` to detach both debuggers at once. This does not stop the containers — run the down command above when you are fully done.

### Troubleshooting

| Symptom                                     | Fix                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| **Waiting for preLaunchTask** popup appears | Click **Debug Anyway** — safe when the stack is already running                 |
| Backend breakpoints show as hollow circles  | Source map mismatch — confirm `WORKDIR` in the backend Dockerfile is `/app`     |
| Breakpoints stop hitting after a file save  | `dotnet watch` restarted the process and the PID changed — hit `F5` to reattach |
| vsdbg missing in container                  | Run `docker exec -it peakmind-v3-backend-1 ls /vsdbg` to verify install         |

---

## Configuration

Edit `backend/appsettings.json` to configure:

- `DefaultConnection` — Postgres connection string
- `Jwt:Key` — signing key (use a strong secret in production)
- `Jwt:Issuer` — token issuer
- `Jwt:Audience` — token audience

---

## Authentication Endpoints

| Method | Endpoint         | Description                                 |
| ------ | ---------------- | ------------------------------------------- |
| POST   | `/auth/register` | Register a new user (email, password, name) |
| POST   | `/auth/login`    | Returns a JWT token                         |

---

## Development Tips

- Always use the Docker + VS Code flow described above rather than running the backend directly on the host — this ensures the database connection and environment variables match.
- If you need an admin user seeded at startup a simple seeder service can be added on request.

---

## Support

Available additions on request:

- Database seeder
- Refresh tokens
- Postman collection

---

## License

MIT
