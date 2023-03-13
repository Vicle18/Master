FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 4005
# EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["ServiceOrchestrator/ServiceOrchestrator.csproj", "ServiceOrchestrator/"]
RUN dotnet restore "ServiceOrchestrator/ServiceOrchestrator.csproj"
COPY . .
WORKDIR "/src/ServiceOrchestrator"
RUN dotnet build "ServiceOrchestrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ServiceOrchestrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ServiceOrchestrator.dll"]
