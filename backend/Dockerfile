FROM mcr.microsoft.com/dotnet/sdk:10.0.202 AS dev
WORKDIR /app
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*
RUN curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"
COPY . .
EXPOSE 80
EXPOSE 4711
CMD ["dotnet", "watch", "run", "--urls", "http://+:80", "--no-launch-profile"]

FROM mcr.microsoft.com/dotnet/sdk:10.0.202 AS build
WORKDIR /src
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
