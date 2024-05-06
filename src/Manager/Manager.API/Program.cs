using Manager.API.Apis;
using Manager.API.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddApiServices();
builder.AddApplicationServices();
builder.AddDefaultOpenApi();

var app = builder.Build();

app.UseDefaultOpenApi();

if (app.Environment.IsDevelopment())
{
    // All health checks must pass for app to be considered ready to accept traffic after starting
    app.MapHealthChecks("/health");

    // Only health checks tagged with the "live" tag must pass for app to be considered alive
    app.MapHealthChecks("/alive", new HealthCheckOptions
    {
        Predicate = r => r.Tags.Contains("live")
    });

    // await app.InitialiseDatabaseAsync(); JaysonTaylor Seed Code
}

app.MapGroup("/api/v1/orders")
   .MapAuthApi()
   .RequireAuthorization();

app.Run();
