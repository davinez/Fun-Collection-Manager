using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddAPIServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        bool isDevelop = environment.IsDevelopment();

        services.AddCors(options =>
        {
            options.AddPolicy(name: "fucoma_policy",
                              policy =>
                              {
                                  if (isDevelop)
                                  {

                                      policy.WithOrigins("http://localhost:5173",
                                                         "http://www.contoso.com")
                                            .AllowAnyMethod()
                                            .AllowAnyHeader()
                                            .AllowCredentials();
                                  }
                                  else
                                  {
                                      policy.WithOrigins("http://www.contoso.com")
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

        services.AddRazorPages();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddDefaultOpenApi(configuration);

        // Add authentication scheme
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(configuration, "EntraExternalID");

        return services;
    }

}
