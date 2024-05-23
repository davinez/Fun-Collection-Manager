﻿using System.Threading;
using System.Threading.Tasks;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace Manager.Application.Common.Behaviors;

public class LoggingBehaviour<TRequest> : IRequestPreProcessor<TRequest> where TRequest : notnull
{
    private readonly ILogger _logger;
    //private readonly IUser _user;
    //private readonly IIdentityService _identityService;

    //public LoggingBehaviour(ILogger<TRequest> logger, IUser user, IIdentityService identityService)
    //{
    //    _logger = logger;
    //    _user = user;
    //    _identityService = identityService;
    //}

    public LoggingBehaviour(ILogger<TRequest> logger)
    {
        _logger = logger;
    }

    public Task Process(TRequest request, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = "placeholder id user 1";
        string? userName = "placeholder username";

        //if (!string.IsNullOrEmpty(userId))
        //{
        //    userName = await _identityService.GetUserNameAsync(userId);
        //}

        _logger.LogInformation("Manager Request: {Name} {@UserId} {@UserName} {@Request}",
            requestName, userId, userName, request);

        // Provisional
        return Task.CompletedTask;
    }
}

