using System.Collections.Generic;
using Manager.Application.Icons.Dto;

namespace Manager.Application.Icons.Queries;

public class AllIconsDto
{
    public required IEnumerable<IconGroupDto> Groups { get; set; }
}
