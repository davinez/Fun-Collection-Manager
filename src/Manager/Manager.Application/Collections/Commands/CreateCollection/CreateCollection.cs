using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces;
using Manager.Domain.Entities;
using MediatR;

namespace Manager.Application.Collections.Commands.CreateCollection;

public record CreateCollectionCommand : IRequest<Unit>
{
    public required string Name { get; init; }
    public required string Icon { get; init; }
    public int GroupId { get; init; }
    public int? ParentCollectionId { get; init; }

}

public class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand, Unit>
{
    private readonly IManagerContext _context;

    public CreateCollectionCommandHandler(IManagerContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
    {
        var newCollection = new Collection()
        {
            Name = request.Name,
            Icon = request.Icon,
            CollectionGroupId = request.GroupId,
            ParentNodeId = request.ParentCollectionId,
        };


        _context.Collections.Add(newCollection);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
