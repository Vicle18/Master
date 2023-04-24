using Serilog;
using ServiceOrchestrator.ContainerManagement;
using ServiceOrchestrator.ContainerManagement.Kubernetes;
using ServiceOrchestrator.Protocols;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {NewLine}{Exception}")
    .MinimumLevel.Debug()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Development"}.json",
        optional: true)
    .AddEnvironmentVariables();
builder.Services.AddControllers();


builder.Services.AddSingleton<IContainerManager, KubernetesManager>();
builder.Services.AddSingleton<IEnvVarCreator, EnvVarCreator>();


builder.Host.UseSerilog();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Enable CORS
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


//app.UseSerilogRequestLogging();

app.Run();