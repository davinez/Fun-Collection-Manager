ARG ENVIRONMENT=dev

FROM mcr.microsoft.com/playwright/dotnet:v1.44.0-jammy AS base

ENV ASPNETCORE_HTTP_PORTS=8081

WORKDIR /app

##### PROD #####

FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build-prod

# Config mode of asp net core
ARG CONFIG_MODE

WORKDIR /src

COPY ["src/Manager/Manager.API/Manager.API.csproj", "Manager.API/"]
COPY ["src/Manager/Manager.Application/Manager.Application.csproj", "Manager.Application/"]
COPY ["src/Manager/Manager.Domain/Manager.Domain.csproj", "Manager.Domain/"]
COPY ["src/Manager/Manager.Infrastructure/Manager.Infrastructure.csproj", "Manager.Infrastructure/"]
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]

# Same as npm install
RUN dotnet restore "Manager.API/Manager.API.csproj"

WORKDIR /src/Manager.API
COPY . .
RUN dotnet build "Manager.API.csproj" -c ${CONFIG_MODE} -o /app/build

FROM build-prod AS publish-prod

RUN dotnet publish "Manager.API.csproj" --no-restore -c ${CONFIG_MODE} -o /app/publish


FROM base AS final-prod

WORKDIR /app

#RUN rm -rf src/*

RUN groupadd -g 2000 nodeuser \
&& useradd -m -u 2001 -g nodeuser nodeuser

RUN chown -R  nodeuser /app

COPY --chown=nodeuser:nodeuser --from=publish-prod /app/publish .

USER nodeuser

EXPOSE 8081

ENTRYPOINT ["dotnet", "Manager.API.dll"]

