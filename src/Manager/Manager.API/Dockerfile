# Layer 1
FROM mcr.microsoft.com/playwright/dotnet:v1.45.0-jammy AS base

ENV ASPNETCORE_HTTP_PORTS=8081

WORKDIR /app

# Layer 2
FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build

# Config mode of asp net core
ARG CONFIG_MODE

WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["src/Manager/Manager.API/Manager.API.csproj", "Manager.API/"]
COPY ["src/Manager/Manager.Application/Manager.Application.csproj", "Manager.Application/"]
COPY ["src/Manager/Manager.Domain/Manager.Domain.csproj", "Manager.Domain/"]
COPY ["src/Manager/Manager.Infrastructure/Manager.Infrastructure.csproj", "Manager.Infrastructure/"]
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]
# Same as npm install
RUN dotnet restore "Manager.API/Manager.API.csproj"

# Copy everything else and build
COPY ["src/Manager/Manager.API", "Manager.API/"]
COPY ["src/Manager/Manager.Application", "Manager.Application/"]
COPY ["src/Manager/Manager.Domain", "Manager.Domain/"]
COPY ["src/Manager/Manager.Infrastructure", "Manager.Infrastructure/"]

# Layer 3
FROM build AS publish

RUN dotnet publish "Manager.API/Manager.API.csproj" --no-restore -c ${CONFIG_MODE} -o /app/publish

# Layer 4
FROM base AS final

WORKDIR /app

RUN rm -rf src/*

RUN groupadd -g 2000 nodeuser \
&& useradd -m -u 2001 -g nodeuser nodeuser

RUN chown -R  nodeuser /app

COPY --chown=nodeuser:nodeuser --from=publish /app/publish .

USER nodeuser

EXPOSE 8081

ENTRYPOINT ["dotnet", "Manager.API.dll"]

