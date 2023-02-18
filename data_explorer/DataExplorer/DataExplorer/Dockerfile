FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["DataExplorer/DataExplorer.csproj", "DataExplorer/"]
RUN dotnet restore "DataExplorer/DataExplorer.csproj"
COPY . .
WORKDIR "/src/DataExplorer"
RUN dotnet build "DataExplorer.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DataExplorer.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DataExplorer.dll"]
