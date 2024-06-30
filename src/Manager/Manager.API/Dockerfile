FROM mcr.microsoft.com/playwright/dotnet:v1.44.0-jammy AS base
WORKDIR /app
EXPOSE 8081
ENV ASPNETCORE_HTTP_PORTS=8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build
# Define a build argument (Config_Mode) for conditional builds
ARG Config_Mode
WORKDIR /src
# Copy project files
COPY ["src/Manager/Manager.API/Manager.API.csproj", "Manager.API/"]
COPY ["src/Manager/Manager.Application/Manager.Application.csproj", "Manager.Application/"]
COPY ["src/Manager/Manager.Domain/Manager.Domain.csproj", "Manager.Domain/"]
COPY ["src/Manager/Manager.Infrastructure/Manager.Infrastructure.csproj", "Manager.Infrastructure/"]
COPY ["Directory.Packages.props", "./"]
COPY ["Directory.Build.props", "./"]

RUN dotnet restore "Manager.API/Manager.API.csproj"
# Copy the entire solution

WORKDIR /src/Manager.API
COPY . .

RUN dotnet build "Manager.API.csproj" -c ${Config_Mode} -o /app/build

FROM build AS publish
RUN dotnet publish "Manager.API.csproj" --no-restore -c ${Config_Mode} -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ARG BUILD_ENVIRONMENT
# This is to fix the bug mentioned here - https://github.com/dotnet/aspnetcore/issues/25152
# Everything works (appsettings transformation) during local debugging, but the environment is not getting picked properly on publish
# Fixing it by replacing the appsettings.json file with the env specific file
# NOTE - This is a blind file replace and hence appsettings transformation will not work; make sure all settings are present in the enc specifci files as well 
COPY /src/Manager/Manager.API/appsettings.${BUILD_ENVIRONMENT}.json .

#RUN chmod +x .playwright/node/linux-x64/node
RUN rm -rf src/*

RUN adduser --disabled-password --gecos '' demo
# Chown all the files to the app user.
RUN chown -R demo /app

USER demo

ENTRYPOINT ["dotnet", "Manager.API.dll"]

