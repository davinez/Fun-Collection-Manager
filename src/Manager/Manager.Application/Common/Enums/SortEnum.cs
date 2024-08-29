namespace Manager.Application.Common.Enums;

// EnumMember or Description attributes are not considered for the Enum serialize/deserialization, only the key name
// https://stackoverflow.com/questions/61611262/handling-enums-in-post-request-body
public enum SortEnum
{
    dateAsc,
    dateDesc,
    nameAsc,
    nameDesc,
    sitesAsc,
    sitesDesc
}
