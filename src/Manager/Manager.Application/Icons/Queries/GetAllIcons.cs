using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Interfaces.Services;
using Manager.Application.Icons.Dto;
using MediatR;

namespace Manager.Application.Icons.Queries;

public class GetAllIconsQuery : IRequest<AllIconsDto>;

public class GetAllIconsQueryHandler : IRequestHandler<GetAllIconsQuery, AllIconsDto>
{
    private readonly IS3StorageService _s3StorageService;

    public GetAllIconsQueryHandler(IS3StorageService s3StorageService)
    {
        _s3StorageService = s3StorageService;
    }

    public async Task<AllIconsDto> Handle(GetAllIconsQuery request, CancellationToken cancellationToken)
    {
        IEnumerable<IconDto> allIcons = await _s3StorageService.GetAllIcons(cancellationToken);

        var response = new AllIconsDto()
        {
            Groups =
            [
               new IconGroupDto()
               {
                   Title = "Standard Icon Collection",
                   Icons = allIcons
               }
            ]
        };

        return response;
    }
}
