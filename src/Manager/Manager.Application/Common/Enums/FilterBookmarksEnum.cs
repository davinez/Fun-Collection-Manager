using System.Runtime.Serialization;

namespace Manager.Application.Common.Enums;

public enum FilterBookmarksEnum
{
    [EnumMember(Value = "info")]
    info,
    [EnumMember(Value = "creationDate")]
    creationDate,
    [EnumMember(Value = "url")]
    url
}
