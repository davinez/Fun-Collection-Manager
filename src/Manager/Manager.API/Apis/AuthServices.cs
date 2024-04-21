using MediatR;
using Microsoft.Extensions.Logging;

namespace Manager.API.Apis;

public class AuthServices(
    IMediator mediator,
    ILogger<AuthServices> logger)
{
    public IMediator Mediator { get; set; } = mediator;
    public ILogger<AuthServices> Logger { get; } = logger;
}
