using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Manager.API.Infrastructure;

public class CustomExceptionHandler : IExceptionHandler
{
    private readonly ILogger<CustomExceptionHandler> _logger;
    private readonly Dictionary<Type, Func<HttpContext, Exception, Task>> _exceptionHandlers;

    public CustomExceptionHandler(ILogger<CustomExceptionHandler> logger)
    {
        _logger = logger;
        // Register known exception types and handlers.
        _exceptionHandlers = new()
            {
                { typeof(ValidationException), HandleValidationException },
                { typeof(NotFoundException), HandleNotFoundException },
                { typeof(UnauthorizedAccessException), HandleUnauthorizedAccessException },
                { typeof(ForbiddenAccessException), HandleForbiddenAccessException },
                { typeof(RemoteServiceException), HandleRemoteServiceException },
                { typeof(ManagerException), HandleManagerException },
            };
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var exceptionType = exception.GetType();

        if (_exceptionHandlers.ContainsKey(exceptionType))
        {
            await _exceptionHandlers[exceptionType].Invoke(httpContext, exception);
            return true;
        }

        // Unhandled / Not specified exception
        await UnhandledException(httpContext, exception);

        return await ValueTask.FromResult(true);
    }

    private async Task HandleValidationException(HttpContext httpContext, Exception ex)
    {
        var exception = (ValidationException)ex;

        _logger.LogError(
              "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
              ex.Message, DateTime.UtcNow, "ValidationException");

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        var errors = exception.Errors.Select(e => new ApiError()
        {
            Domain = e.Key,
            Message = string.Join("|", e.Value)
        }).ToList();

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status400BadRequest,
                Message = "Validation Problem. https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Errors = errors
            }

        });
    }

    private async Task HandleNotFoundException(HttpContext httpContext, Exception ex)
    {     
        var exception = (NotFoundException)ex;

        _logger.LogError(
              "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
              ex.Message, DateTime.UtcNow, "NotFoundException");

        httpContext.Response.StatusCode = StatusCodes.Status404NotFound;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status404NotFound,
                Message = "The specified resource was not found.",
                Errors =
                [
                    new()
                    {
                        Domain = exception.Source,
                        Reason = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                        Message = exception.Message
                    }
                ]
            }

        });
    }

    private async Task HandleUnauthorizedAccessException(HttpContext httpContext, Exception ex)
    {
        _logger.LogError(
              "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
              ex.Message, DateTime.UtcNow, "UnauthorizedAccessException");

        httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status401Unauthorized,
                Message = "Unauthorized",
                Errors =
               [
                   new()
                    {
                        Domain = "",
                        Reason = "https://tools.ietf.org/html/rfc7235#section-3.1",
                        Message = ""
                    }
               ]
            }

        });
    }

    private async Task HandleForbiddenAccessException(HttpContext httpContext, Exception ex)
    {
        _logger.LogError(
               "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
               ex.Message, DateTime.UtcNow, "ForbiddenAccessException");

        httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status403Forbidden,
                Message = "Forbidden",
                Errors =
                [
                    new()
                    {
                        Domain = "",
                        Reason = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                        Message = ""
                    }
                ]
            }

        });
    }

    private async Task HandleRemoteServiceException(HttpContext httpContext, Exception ex)
    {
        _logger.LogError(
               "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
               ex.Message, DateTime.UtcNow, "RemoteServiceException");

        httpContext.Response.StatusCode = StatusCodes.Status409Conflict;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status409Conflict,
                Message = "Conflict",
                Errors =
                [
                    new()
                    {
                        Domain = "",
                        Reason = "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                        Message = ""
                    }
                ]
            }

        });
    }

    private async Task HandleManagerException(HttpContext httpContext, Exception ex)
    {
        var exception = (ManagerException)ex;

        _logger.LogError(
                "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
                ex.Message, DateTime.UtcNow, "ManagerException");

        httpContext.Response.StatusCode = StatusCodes.Status409Conflict;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status409Conflict,
                Message = "Conflict",
                Errors =
                [
                    new()
                    {
                        Domain = exception.Source,
                        Reason = "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                        Message = exception.Message,
                    }
                ]
            }

        });
    }

    private async Task UnhandledException(HttpContext httpContext, Exception ex)
    {
        var exceptionMessage = ex.Message;

        _logger.LogError(
                "Error Message: {exceptionMessage}, Time of occurrence {time} of type {exceptionType}",
                ex.Message, DateTime.UtcNow, "UnhandledException");

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(new ApiErrorResponse()
        {
            ApiVersion = "1.0",
            Error = new ApiTopLevelError()
            {
                Code = StatusCodes.Status500InternalServerError,
                Message = "UnhandledException",
                Errors =
                [
                    new()
                    {
                        Domain = ex.Source,
                        Reason = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
                        Message = "Unexpected error occurred",
                    }
                ]
            }

        });
    }
}
