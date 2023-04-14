// See https://aka.ms/new-console-template for more information

using System;
using IngressAdapter.BusCommunication;
using IngressAdapter.Controller;
using IngressAdapter.IngressCommunication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace IngressAdapter
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {NewLine}{Exception}")
                .WriteTo.File("log.txt", rollingInterval: RollingInterval.Day)
                .MinimumLevel.Debug()
                .CreateBootstrapLogger();
            
            var host = Host.CreateDefaultBuilder()
                .ConfigureServices((context, services) =>
                {
                    services.AddSingleton<IController, Controller.Controller>();
                    services.AddSingleton<IBusClient, BusClient>();
                    services.AddTransient<IIngressClientCreator, IngressClientCreator>();


                }).ConfigureAppConfiguration((config) =>
                {
                    config.SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Development"}.json", optional: true)
                        .AddEnvironmentVariables();
                })
                .UseSerilog()
                .Build();
            
            var controller = ActivatorUtilities.GetServiceOrCreateInstance<IController>(host.Services);
            var config = ActivatorUtilities.GetServiceOrCreateInstance<IConfiguration>(host.Services);
            Log.Information("Ingress adapter {id} is starting", config.GetValue<string>("ID"));
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
            Log.Information("Ingress adapter {id} is stopping", config.GetValue<string>("ID"));
        }
    }
}