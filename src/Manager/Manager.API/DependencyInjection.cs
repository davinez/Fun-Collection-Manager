using System.Security.Claims;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.API.Services;
using Manager.Application.Common.Interfaces.Services;
using Manager.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;

namespace Manager.API;

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
        // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        //         .AddMicrosoftIdentityWebApi(configuration, "EntraIDAuthConfig", "Bearer",true);

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
            options.AddPolicy("Administrator", policy => policy.RequireRole("Administrator"));
            options.AddPolicy("General.Level1", policy => policy.RequireRole("General.Level1"));

            options.AddPolicy("All", policy =>
                     policy.RequireAssertion(context =>
                             context.User.HasClaim(ClaimTypes.Role, "Administrator") ||
                             context.User.HasClaim(ClaimTypes.Role, "General.Level1")));
        });

        services.AddScoped<IUser, CurrentUser>();
        services.AddHttpClient();

        return services;
    }

}
