﻿using Microsoft.AspNetCore.Routing;
using System.Diagnostics.CodeAnalysis;
using System;
using Microsoft.AspNetCore.Builder;
using Ardalis.GuardClauses;
using Manager.API.Config.Extensions;

namespace Manager.API.Config.Extensions;

public static class IEndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapGet(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern = "")
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapGet(pattern, handler)
            .WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapPost(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern = "")
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPost(pattern, handler)
            .WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapPut(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern)
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPut(pattern, handler)
            .WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapPatch(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern, bool disableAntiForgery = false)
    {
        Guard.Against.AnonymousMethod(handler);

        if (disableAntiForgery)
        {
            builder.MapPatch(pattern, handler)
                   .WithName(handler.Method.Name)
                   .DisableAntiforgery();

            return builder;
        }

        builder.MapPatch(pattern, handler)
               .WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapDelete(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern)
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapDelete(pattern, handler)
            .WithName(handler.Method.Name);

        return builder;
    }
}
