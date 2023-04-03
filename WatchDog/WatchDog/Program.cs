using Serilog;
using WatchDog.BusCommunication;
using WatchDog.ContainerManagement;
using WatchDog.ContainerManagement.Kubernetes;
using WatchDog.Controller;
using WatchDog.Repositories;

namespace WatchDog
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {NewLine}{Exception}")
                .MinimumLevel.Debug()
                .CreateBootstrapLogger();

            var host = Host.CreateDefaultBuilder()
                .ConfigureServices((context, services) =>
                {
                    services.AddSingleton<IController, Controller.Controller>();
                    //services.AddSingleton<IBusClient, BusClient>();
                    services.AddSingleton<IEgressRepository, EgressRepository>();
                    services.AddSingleton<IIngressRepository, IngressRepository>();
                }).ConfigureAppConfiguration((config) =>
                {
                    config.SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .AddJsonFile(
                            $"appsettings.{Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Development"}.json",
                            optional: true)
                        .AddEnvironmentVariables();
                })
                .UseSerilog()
                .Build();

            var controller = ActivatorUtilities.GetServiceOrCreateInstance<IController>(host.Services);
            var config = ActivatorUtilities.GetServiceOrCreateInstance<IConfiguration>(host.Services);
            Log.Information("Watchdog {id} is starting", config.GetValue<string>("ID"));
            try
            {
                controller.Initialize();
                controller.StartTransmission();
            }
            catch (Exception e)
            {
                Log.Fatal(e, "An error occured: {error}", e.Message);
            }

            Thread.Sleep(500);
            Log.Information("WatchDog is stopping");
        }
    }
}


/*var builder = WebApplication.CreateBuilder(args);


Log.Information("Watchdog {id} is starting", config.GetValue<string>("ID"));


builder.Services.AddCors();
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Development"}.json", optional: true)
    .AddEnvironmentVariables();
builder.Services.AddControllers();


//builder.Services.AddSingleton<IContainerManager, KubernetesManager>();
builder.Services.AddSingleton<IContainerManager, KubernetesManager>();
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

app.Run();*/