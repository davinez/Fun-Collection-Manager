using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NSwag;
using NSwag.Generation.Processors.Security;

namespace Manager.API.Infrastructure.Extensions;

public static partial class OpenApiExtensions
{
    public static IServiceCollection AddDefaultOpenApi(this IServiceCollection services, IConfiguration configuration)
    {
        //var openApi = configuration.GetSection("OpenApi");

        //if (!openApi.Exists())
        //{
        //    return services;
        //}

        //services.AddEndpointsApiExplorer();

        //services.AddSwaggerGen(options =>
        //{
        //    /// {
        //    ///   "OpenApi": {
        //    ///     "Document": {
        //    ///         "Title": ..
        //    ///         "Version": ..
        //    ///         "Description": ..
        //    ///     }
        //    ///   }
        //    /// }
        //    var document = openApi.GetRequiredSection("Document");

        //    var version = document.GetRequiredValue("Version") ?? "v1";

        //    options.SwaggerDoc(version, new OpenApiInfo
        //    {
        //        Title = document.GetRequiredValue("Title"),
        //        Version = version,
        //        Description = document.GetRequiredValue("Description")
        //    });

        //    var identitySection = configuration.GetSection("Identity");

        //    if (!identitySection.Exists())
        //    {
        //        // No identity section, so no authentication open api definition
        //        return;
        //    }

        //    // {
        //    //   "Identity": {
        //    //     "Url": "http://identity",
        //    //     "Scopes": {
        //    //         "basket": "Basket API"
        //    //      }
        //    //    }
        //    // }

        //    var identityUrlExternal = identitySection.GetRequiredValue("Url");
        //    var scopes = identitySection.GetRequiredSection("Scopes").GetChildren().ToDictionary(p => p.Key, p => p.Value);

        //    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        //    {
        //        Type = SecuritySchemeType.OAuth2,
        //        Flows = new OpenApiOAuthFlows()
        //        {
        //            // TODO: Change this to use Authorization Code flow with PKCE
        //            Implicit = new OpenApiOAuthFlow()
        //            {
        //                AuthorizationUrl = new Uri($"{identityUrlExternal}/connect/authorize"),
        //                TokenUrl = new Uri($"{identityUrlExternal}/connect/token"),
        //                Scopes = scopes,
        //            }
        //        }
        //    });

        //    options.OperationFilter<AuthorizeCheckOperationFilter>([scopes.Keys.ToArray()]);
        //});

        services.AddEndpointsApiExplorer();
        services.AddOpenApiDocument((configure, sp) =>
        {
            configure.Title = "CleanArchitecture API";

            // Add JWT
            configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the textbox: Bearer {your JWT token}."
            });

            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));

        });

        return services;
    }

    public static IApplicationBuilder UseDefaultOpenApi(this WebApplication app)
    {
        //var configuration = app.Configuration;
        //var openApiSection = configuration.GetSection("OpenApi");

        //if (!openApiSection.Exists())
        //{
        //    return app;
        //}

        //app.UseSwagger();
        //if (app.Environment.IsDevelopment())
        //{
        //    app.UseSwaggerUI(setup =>
        //    {
        //        /// {
        //        ///   "OpenApi": {
        //        ///     "Endpoint: {
        //        ///         "Name": 
        //        ///     },
        //        ///     "Auth": {
        //        ///         "ClientId": ..,
        //        ///         "AppName": ..
        //        ///     }
        //        ///   }
        //        /// }

        //        var pathBase = configuration["PATH_BASE"];
        //        var authSection = openApiSection.GetSection("Auth");
        //        var endpointSection = openApiSection.GetRequiredSection("Endpoint");

        //        var swaggerUrl = endpointSection["Url"] ?? $"{(!string.IsNullOrEmpty(pathBase) ? pathBase : string.Empty)}/swagger/v1/swagger.json";

        //        setup.SwaggerEndpoint(swaggerUrl, endpointSection.GetRequiredValue("Name"));

        //        if (authSection.Exists())
        //        {
        //            setup.OAuthClientId(authSection.GetRequiredValue("ClientId"));
        //            setup.OAuthAppName(authSection.GetRequiredValue("AppName"));
        //        }
        //    });

        //    // Add a redirect from the root of the app to the swagger endpoint
        //    app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
        //}

        // Add OpenAPI 3.0 document serving middleware
        // Available at: http://localhost:<port>/swagger/v1/swagger.json
        app.UseOpenApi();

        // Add web UIs to interact with the document
        // Available at: http://localhost:<port>/swagger
        app.UseSwaggerUi(); // UseSwaggerUI Protected by if (env.IsDevelopment())

        return app;
    }
}
