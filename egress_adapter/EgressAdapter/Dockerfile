FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["EgressAdapter/EgressAdapter.csproj", "EgressAdapter/"]
RUN dotnet restore "EgressAdapter/EgressAdapter.csproj"
COPY . .
WORKDIR "/src/EgressAdapter"
RUN dotnet build "EgressAdapter.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EgressAdapter.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EgressAdapter.dll"]
