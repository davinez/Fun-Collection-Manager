using System;
using System.Collections.Generic;
using System.Security.Claims;
using Azure.Identity;
using Manager.API.Endpoints;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.API.Services;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Manager.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Manager.API;

public static class DependencyInjection
{
    public static IServiceCollection AddKeyVaultIfConfigured(this IServiceCollection services, IWebHostEnvironment environment, ConfigurationManager configuration)
    {
        var keyVaultUri = configuration["KEY_VAULT_PROD_ENDPOINT"];
        
        if (environment.IsProduction() 
            && !string.IsNullOrWhiteSpace(keyVaultUri))
        {
            // We need the environment variables:
            // AZURE_CLIENT_ID,
            // AZURE_TENANT_ID,
            // AZURE_CLIENT_SECRET
            // to make sure the DefaultAzureCredential will work.
            configuration.AddAzureKeyVault(
                new Uri(keyVaultUri),
                new DefaultAzureCredential());
        }

        return services;
    }

    public static ILoggingBuilder AddLoggingConfiguration(this ILoggingBuilder logging, IConfiguration configuration, IWebHostEnvironment environment)
    {
        string otelCollectorUrl = configuration["OpenTelemetry:OtelCollectorUrl"] ?? throw new ManagerException("OpenTelemetry:OtelCollectorUrl");

        var loggingResource = ResourceBuilder.CreateDefault().AddService(
     serviceName: "ManagerWebApi",
     serviceVersion: "1.0.0"
     )
    .AddAttributes(new Dictionary<string, object>
    {
        ["app"] = "managerwebApi",
        ["runtime"] = "dotnet",
    });

        // Clear default logging providers used by WebApplication host.
        // logging.ClearProviders();

        logging.AddOpenTelemetry(logging =>
        {
            // The rest of your setup code goes here
            logging.AddOtlpExporter(options =>
            {
                options.Endpoint = new Uri($"{otelCollectorUrl}/v1/logs");
                options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;

                if (!environment.IsDevelopment())
                {
                    string headerValue = configuration["OpenTelemetry:AccessTokenGateway"] ?? throw new ManagerException("OpenTelemetry:AccessTokenGateway");
                    options.Headers = $"Authorization=Basic {headerValue}";
                }

            });

            logging.SetResourceBuilder(loggingResource);
        });

        return logging;
    }

    public static IServiceCollection AddAPIServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        // Not in use until a grafana alloy or otel collector is deployed (selfhosted)
        string otelCollectorUrl = configuration["OpenTelemetry:OtelCollectorUrl"] ?? throw new ManagerException("OpenTelemetry:OtelCollectorUrl");

        services.AddOpenTelemetry()
      .WithTracing(tracing => tracing
        .AddSource("ManagerWebApi")
        .ConfigureResource(resource => resource
          .AddService("ManagerWebApi"))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri($"{otelCollectorUrl}/v1/traces");
            options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;

            if (!environment.IsDevelopment())
            {
                string headerValue = configuration["OpenTelemetry:AccessTokenGateway"] ?? throw new ManagerException("OpenTelemetry:AccessTokenGateway");
                options.Headers = $"Authorization=Basic {headerValue}";
            }
        }))
      .WithMetrics(metrics => metrics
        .ConfigureResource(resource => resource
            .AddService("ManagerWebApi"))
        .AddRuntimeInstrumentation()
        .AddAspNetCoreInstrumentation()
        .AddProcessInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter(options =>
        {
            options.Endpoint = new Uri($"{otelCollectorUrl}/v1/metrics");
            options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;

            if (!environment.IsDevelopment())
            {
                string headerValue = configuration["OpenTelemetry:AccessTokenGateway"] ?? throw new ManagerException("OpenTelemetry:AccessTokenGateway");
                options.Headers = $"Authorization=Basic {headerValue}";
            }
        }));

        bool isDevelop = environment.IsDevelopment();

        services.AddCors(options =>
        {
            options.AddPolicy(name: "fucoma_policy",
                              policy =>
                              {
                                  if (isDevelop)
                                  {
                                      policy.AllowAnyOrigin()
                                            .AllowAnyMethod()
                                            .AllowAnyHeader()
                                            .AllowCredentials();
                                  }
                                  else
                                  {
                                      policy
                                       .SetIsOriginAllowedToAllowWildcardSubdomains()
                                       .WithOrigins("https://*.davidnez.work", "http://localhost:5173")
                                       .AllowAnyHeader()
                                       .AllowAnyMethod();
                                  }
                              });
        });

        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddHttpContextAccessor();

        services.AddHealthChecks()
            .AddDbContextCheck<ManagerContext>();

        services.AddExceptionHandler<CustomExceptionHandler>();

        services.AddControllers();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddDefaultOpenApi(configuration);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(options =>
                {

                    configuration.Bind("EntraIDAuthConfig", options);
                    options.Events = new JwtBearerEvents();

                    // The following lines code instruct the asp.net core middleware to use the data in the "roles" claim in the [Authorize] attribute, policy.RequireRole() and User.IsInRole()
                    // See https://docs.microsoft.com/aspnet/core/security/authorization/roles for more info.
                    // https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/5-WebApp-AuthZ/5-2-Groups/Startup.cs
                    // options.TokenValidationParameters.RoleClaimType = "groups";

                    /// <summary>
                    /// Below you can do extended token validation and check for additional claims, such as:
                    ///
                    /// - check if the caller's tenant is in the allowed tenants list via the 'tid' claim (for multi-tenant applications)
                    /// - check if the caller's account is homed or guest via the 'acct' optional claim
                    /// - check if the caller belongs to right roles or groups via the 'roles' or 'groups' claim, respectively
                    ///
                    /// Bear in mind that you can do any of the above checks within the individual routes and/or controllers as well.
                    /// For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validate-the-user-has-permission-to-access-this-data
                    /// </summary>

                    //options.Events.OnTokenValidated = async context =>
                    //{
                    //    string[] allowedClientApps = { /* list of client ids to allow */ };

                    //    string clientappId = context?.Principal?.Claims
                    //        .FirstOrDefault(x => x.Type == "azp" || x.Type == "appid")?.Value;

                    //    if (!allowedClientApps.Contains(clientappId))
                    //    {
                    //        throw new System.Exception("This client is not authorized");
                    //    }
                    //};
                }, options => { configuration.Bind("EntraIDAuthConfig", options); }, "Bearer", true);

        services.AddAuthorization(options =>
        {
            //options.AddPolicy("Administrator", policy => policy.RequireRole("Administrator"));
            //options.AddPolicy("General.Level1", policy => policy.RequireRole("General.Level1"));

            options.AddPolicy("All", policy =>
            {
                policy.RequireAssertion(context =>
                             context.User.HasClaim(ClaimTypes.Role, "Administrator") ||
                             context.User.HasClaim(ClaimTypes.Role, "General.Level1"));

                string[] scopesClaim = configuration.GetSection("EntraIDAuthConfig:Scopes").Get<string[]>() ?? throw new ArgumentNullException($"Null value for Scopes in {nameof(CollectionGroups)}");

                // All scopes are required, not only one of allowedValues
                foreach (var scopeClaim in scopesClaim)
                {
                    policy.RequireScope(scopeClaim);
                }
            });

        });

        services.AddScoped<IUser, CurrentUser>();

        return services;
    }

}
