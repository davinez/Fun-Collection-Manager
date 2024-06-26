﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Manager.API.Infrastructure;
using Manager.API.Infrastructure.Extensions;
using Manager.Application.Common.Models;
using Manager.Application.Icons.Dto;
using Manager.Application.Icons.Queries;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;

namespace Manager.API.Endpoints;

public class Icons : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization("All")
            .MapGet(GetAllIcons);
    }

    public async Task<ApiResponse<IEnumerable<IconDto>>> GetAllIcons([FromServices] ISender sender)
    {
        var data = await sender.Send(new GetAllIconsQuery());

        return new ApiResponse<IEnumerable<IconDto>>
        {
            Data = data
        };
    }

}

