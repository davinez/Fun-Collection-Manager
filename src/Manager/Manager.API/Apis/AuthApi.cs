using System;
using System.Threading.Tasks;
using Manager.API.Application.Models.Requests.AuthApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace Manager.API.Apis;

public static class AuthApi
{
    public static RouteGroupBuilder MapAuthApi(this RouteGroupBuilder app)
    {
        app.MapPost("/authenticate", AuthenticateAsync);
        return app;
    }

    public static async Task<Results<Ok, BadRequest<string>>> AuthenticateAsync(
    [FromHeader(Name = "x-requestid")] Guid requestId,
    AuthenticateRequest request,
    [AsParameters] AuthServices services
     )
    {
        await Task.Run(() => { });

        services.Logger.LogInformation("Receiving Authentication Request: {RequestId})", requestId);

        if (requestId == Guid.Empty)
        {
            services.Logger.LogWarning("Invalid IntegrationEvent - RequestId is missing - {@IntegrationEvent}", request);
            return TypedResults.BadRequest("RequestId is missing.");
        }

        return TypedResults.Ok();

    }
}
