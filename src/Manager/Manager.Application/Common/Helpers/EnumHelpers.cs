using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using Manager.Application.Common.Enums;

namespace Manager.Application.Common.Helpers;

public static class EnumHelpers
{
    public static string? ToEnumMember<T>(this T value) where T : Enum
    {
        return typeof(T)
            .GetTypeInfo()
            .DeclaredMembers
            .SingleOrDefault(x => x.Name == value.ToString())?
            .GetCustomAttribute<EnumMemberAttribute>(false)?
            .Value;
    }

    public static string GetSortValue(SortEnum sortType)
    {
        switch (sortType)
        {
            case SortEnum.dateAsc:
                return "CreatedAt asc";
            case SortEnum.dateDesc:
                return "CreatedAt desc";
            case SortEnum.nameAsc:
                return "Title asc";
            case SortEnum.nameDesc:
                return "Title desc";
            case SortEnum.sitesAsc:
                return "WebsiteUrl asc";
            case SortEnum.sitesDesc:
                return "WebsiteUrl desc";
            default:
                return "CreatedAt asc";
        }
    }

}
