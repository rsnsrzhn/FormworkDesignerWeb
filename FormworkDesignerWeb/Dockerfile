FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY FormworkDesignerWeb/FormworkDesignerWeb.csproj FormworkDesignerWeb/
RUN dotnet restore FormworkDesignerWeb/FormworkDesignerWeb.csproj
COPY FormworkDesignerWeb/ FormworkDesignerWeb/
RUN dotnet publish FormworkDesignerWeb/FormworkDesignerWeb.csproj -c Release -o /out --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
ENV Site__DataDirectory=/data
USER $APP_UID
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "FormworkDesignerWeb.dll"]
