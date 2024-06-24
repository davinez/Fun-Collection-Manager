using System.Threading;
using System.Threading.Tasks;
using Ardalis.GuardClauses;
using Manager.Application.Common.Interfaces;
using MediatR;

namespace Manager.Application.Collections.Commands.UpdateCollection;

public record PatchCollectionCommand : IRequest<Unit>
{
    public int CollectionId { get; set; }
    public required string Name { get; init; }

}

public class PatchCollectionCommandHandler : IRequestHandler<PatchCollectionCommand, Unit>
{
    private readonly IManagerContext _context;

    public PatchCollectionCommandHandler(IManagerContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(PatchCollectionCommand request, CancellationToken cancellationToken)
    {
        var collection = await _context.Collections.FindAsync(request.CollectionId, cancellationToken);

        Guard.Against.NotFound(request.CollectionId, collection);

        collection.Name = request.Name;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

