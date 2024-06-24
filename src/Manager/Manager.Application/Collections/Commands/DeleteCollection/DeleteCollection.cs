using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using MediatR;

namespace Manager.Application.Collections.Commands.DeleteCollection;

public record DeleteCollectionCommand : IRequest<Unit>
{
    public int CollectionId { get; init; }
}

public class DeleteCollectionCommandHandler : IRequestHandler<DeleteCollectionCommand, Unit>
{
    private readonly IManagerContext _context;

    public DeleteCollectionCommandHandler(IManagerContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections.FindAsync(request.CollectionId, cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        _context.Collections.Remove(collection);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

