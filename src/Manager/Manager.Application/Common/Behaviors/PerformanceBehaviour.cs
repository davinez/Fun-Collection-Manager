using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Manager.Application.Common.Behaviors;

public class PerformanceBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly Stopwatch _timer;
    private readonly ILogger<TRequest> _logger;

    private readonly IUser _user;

    public PerformanceBehaviour(ILogger<TRequest> logger, IUser user)
    {
        _timer = new Stopwatch();

        _logger = logger;
        _user = user;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _timer.Start();

        var response = await next();

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 600)
        {
            var requestName = typeof(TRequest).Name;
            var userIdentityProviderId = _user.HomeAccountId;

            _logger.LogWarning("Manager Long Running Request: {0} ({1} milliseconds) {3} {4}",
                requestName, elapsedMilliseconds, userIdentityProviderId, request);
        }
        else
        {
            var requestName = typeof(TRequest).Name;
            var userIdentityProviderId = _user.HomeAccountId;

            _logger.LogInformation("Manager Running Request: {0} ({1} milliseconds) {2} {3}",
                requestName, elapsedMilliseconds, userIdentityProviderId, request);
        }

        return response;
    }
}
