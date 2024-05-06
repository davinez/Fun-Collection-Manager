using FluentValidation;
using Manager.API.Application.Behaviors;
using Manager.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace Manager.API.Extensions;

public static class ServiceExtensions
{
    public static IHostApplicationBuilder AddApiServices(this IHostApplicationBuilder builder)
    {
         var services = builder.Services;

        // services.AddCors

        // Default health checks assume the event bus and self health checks
        builder.AddDefaultHealthChecks();

        builder.ConfigureOpenTelemetry();

        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            // Turn on resilience by default
            http.AddStandardResilienceHandler();
        });

        return builder;
    }

    public static IHostApplicationBuilder AddApplicationServices(this IHostApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        // Add the authentication services to DI
        builder.AddDefaultAuthentication();

        services.AddDbContext<ManagerContext>(options =>
        {
            options.UseNpgsql(builder.Configuration.GetConnectionString("managerdb"));
        });

        services.AddHttpContextAccessor();

        // Configure mediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblyContaining(typeof(Program));

            cfg.AddOpenBehavior(typeof(ValidatorBehavior<,>));
        });

        // Register the command validators for the validator behavior (validators based on FluentValidation library)
        // services.AddSingleton<IValidator<CreateOrderCommand>, CreateOrderCommandValidator>();

        // services.AddScoped<IOrderQueries, OrderQueries>();

        services.AddProblemDetails();

        return builder;
    }

    private static IServiceCollection AddDefaultAuthentication(this IHostApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        // {
        //   "Identity": {
        //     "Url": "http://identity",
        //     "Audience": "basket"
        //    }
        // }

        var identitySection = configuration.GetSection("Identity");

        if (!identitySection.Exists())
        {
            // No identity section, so no authentication
            return services;
        }

        // prevent from mapping "sub" claim to nameidentifier.
        // JsonWebTokenHandler.DefaultInboundClaimTypeMap.Remove("sub");
        // "sub" claim missing on User.Identity
        // JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();

        services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                var identityUrl = identitySection.GetRequiredValue("Url");
                var audience = identitySection.GetRequiredValue("Audience");

                options.Authority = identityUrl;
                options.RequireHttpsMetadata = false;
                options.Audience = audience;
                options.TokenValidationParameters.ValidateAudience = false;
            });

        services.AddAuthorization();

        return services;
    }

    private static IHostApplicationBuilder ConfigureOpenTelemetry(this IHostApplicationBuilder builder)
    {
        builder.Logging.AddOpenTelemetry(logging =>
        {
            logging.IncludeFormattedMessage = true;
            logging.IncludeScopes = true;
        });

        builder.Services.AddOpenTelemetry()
            .WithMetrics(metrics =>
            {
                metrics.AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddRuntimeInstrumentation();
            })
            .WithTracing(tracing =>
            {
                if (builder.Environment.IsDevelopment())
                {
                    // We want to view all traces in development
                    tracing.SetSampler(new AlwaysOnSampler());
                }

                tracing.AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation();
            });

        // AddOpenTelemetryExporters();
        var useOtlpExporter = !string.IsNullOrWhiteSpace(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);

        if (useOtlpExporter)
        {
            builder.Services.Configure<OpenTelemetryLoggerOptions>(logging => logging.AddOtlpExporter());
            builder.Services.ConfigureOpenTelemetryMeterProvider(metrics => metrics.AddOtlpExporter());
            builder.Services.ConfigureOpenTelemetryTracerProvider(tracing => tracing.AddOtlpExporter());
        }


        return builder;
    }

    private static IHostApplicationBuilder AddDefaultHealthChecks(this IHostApplicationBuilder builder)
    {
        builder.Services.AddHealthChecks()
            // Add a default liveness check to ensure app is responsive
            .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

        return builder;
    }

}
