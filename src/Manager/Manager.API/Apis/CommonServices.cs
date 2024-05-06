using MediatR;
using Microsoft.Extensions.Logging;

namespace Manager.API.Apis;

public class CommonServices(
    IMediator mediator,
    ILogger<CommonServices> logger)
{
    public IMediator Mediator { get; set; } = mediator;
    public ILogger<CommonServices> Logger { get; } = logger;
}
