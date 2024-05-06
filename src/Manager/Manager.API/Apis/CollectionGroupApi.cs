using System;
using System.Threading.Tasks;
using Manager.API.Application.Models.Requests.AuthApi;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace Manager.API.Apis;

public static class CollectionGroupApi
{
    public static RouteGroupBuilder MapCollectionGroupApi(this RouteGroupBuilder app)
    {
        app.MapGet("/", GetCollectionGroups);
        //app.MapGet("/{groupId:int}", AuthenticateAsync);
        //app.MapPost("/", AuthenticateAsync);
        //app.MapPut("/", AuthenticateAsync);
        //app.MapDelete("/", AuthenticateAsync);

        return app;
    }

    public static async Task<Results<Ok, BadRequest<string>>> GetCollectionGroups(
    [AsParameters] CommonServices services,
    [FromHeader(Name = "x-requestid")] Guid requestId,
    // [FromRoute] int groupId,
    [AsParameters] AuthenticateRequest request
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
