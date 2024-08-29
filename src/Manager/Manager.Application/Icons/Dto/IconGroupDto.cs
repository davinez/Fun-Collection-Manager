using System.Collections.Generic;

namespace Manager.Application.Icons.Dto;

public class IconGroupDto
{
    public required string Title { get; set; }
    public required IEnumerable<IconDto> Icons { get; set; }
}
