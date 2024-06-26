using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Collections.Queries.GetCollectionById;
using Manager.Application.Icons.Dto;
using MediatR;

namespace Manager.Application.Icons.Queries;

public class GetAllIconsQuery : IRequest<IEnumerable<IconDto>>;


public class GetAllIconsQueryHandler : IRequestHandler<GetAllIconsQuery, IEnumerable<IconDto>>
{

    public GetAllIconsQueryHandler()
    {

    }

    public async Task<IEnumerable<IconDto>> Handle(GetAllIconsQuery request, CancellationToken cancellationToken)
    {
        

        var icons = new List<IconDto>
                        {
                            new() { Name = "Home" },
                            new() { Name = "Settings" },
                            // Add more icons here
                        };

        return icons;
    }
}
