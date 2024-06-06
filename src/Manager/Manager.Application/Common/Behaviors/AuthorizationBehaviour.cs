using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Manager.Application.Common.Behaviors;

public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{

    public AuthorizationBehaviour()
    {

    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {


        // User is authorized / authorization not required
        return await next();
    }
}
