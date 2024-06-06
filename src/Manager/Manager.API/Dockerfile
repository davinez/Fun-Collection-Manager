# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8081
ENV ASPNETCORE_HTTP_PORTS=8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

ARG Config_Mode

WORKDIR /src
COPY ["src/Manager/Manager.API/Manager.API.csproj", "Manager.API/"]
COPY ["src/Manager/Manager.Application/Manager.Application.csproj", "Manager.Application/"]
COPY ["src/Manager/Manager.Domain/Manager.Domain.csproj", "Manager.Domain/"]
COPY ["src/Manager/Manager.Infrastructure/Manager.Infrastructure.csproj", "Manager.Infrastructure/"]
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]
RUN dotnet restore "Manager.API/Manager.API.csproj"
COPY . .
WORKDIR /src/Manager.API
RUN dotnet build "./Manager.API.csproj" -c ${Config_Mode} -o /app/build

FROM build AS publish
RUN dotnet publish --no-restore -c ${Config_Mode} -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Manager.API.dll"]