FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 81
EXPOSE 444

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WatchDog.csproj", "./"]
RUN dotnet restore "WatchDog.csproj"
COPY . .
WORKDIR "/src/WatchDog"
RUN dotnet build "WatchDog.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WatchDog.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WatchDog.dll"]
