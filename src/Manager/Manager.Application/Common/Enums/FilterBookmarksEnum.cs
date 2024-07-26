using System.Runtime.Serialization;

namespace Manager.Application.Common.Enums;

public enum FilterBookmarksEnum
{
    [EnumMember(Value = "info")]
    Info,
    [EnumMember(Value = "creationDate")]
    CreationDate,
    [EnumMember(Value = "url")]
    URL
}
