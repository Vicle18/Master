FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["IngressAdapter/IngressAdapter.csproj", "IngressAdapter/"]
RUN dotnet restore "IngressAdapter/IngressAdapter.csproj"
COPY . .
WORKDIR "/src/IngressAdapter"
RUN dotnet build "IngressAdapter.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IngressAdapter.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IngressAdapter.dll"]
