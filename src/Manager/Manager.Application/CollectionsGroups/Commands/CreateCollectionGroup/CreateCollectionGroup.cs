using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces;
using Manager.Domain.Entities;
using MediatR;

namespace Manager.Application.CollectionsGroups.Commands.CreateCollectionGroup;

public record CreateCollectionGroupCommand : IRequest<int>
{
    public string? Name { get; init; }
}

public class CreateCollectionGroupCommandHandler : IRequestHandler<CreateCollectionGroupCommand, int>
{
    private readonly IManagerContext _context;

    public CreateCollectionGroupCommandHandler(IManagerContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCollectionGroupCommand request, CancellationToken cancellationToken)
    {
        var entity = new CollectionGroup
        {
            Name = request.Name,
            UserAccountId = 4
        };

        _context.CollectionGroups.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}

