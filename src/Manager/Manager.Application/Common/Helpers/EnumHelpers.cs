using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using Manager.Application.Common.Enums;
using Manager.Application.Common.Exceptions;

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
                return "BookmarkCreatedAt asc";
            case SortEnum.dateDesc:
                return "BookmarkCreatedAt desc";
            case SortEnum.nameAsc:
                return "Title asc";
            case SortEnum.nameDesc:
                return "Title desc";
            case SortEnum.sitesAsc:
                return "WebsiteUrl asc";
            case SortEnum.sitesDesc:
                return "WebsiteUrl desc";
            default:
                return "BookmarkCreatedAt asc";
        }
    }

    public static (string, object[]) GetFilterBookmarkValue(FilterBookmarksEnum? filterType, string? searchValue)
    {
        if (filterType == null && searchValue == null)
        {
            return ("1 == 1", []);
        }

        switch (filterType)
        {
            case FilterBookmarksEnum.creationDate:

                // Lenght 4 => YYYY
                // Lenght 7 => YYYY-MM
                // Lenght 10 => YYYY-MM-DD
                // Lenght 11 => >YYYY-MM-DD or <YYYY-MM-DD

                if (searchValue!.Length == 4)
                {
                    DateTimeOffset from = new DateTimeOffset(new DateTime(int.Parse(searchValue), 1, 1));
                    DateTimeOffset to = new DateTimeOffset(new DateTime(int.Parse(searchValue), 12, 31));

                    return ("BookmarkCreatedAt > @0 &&  BookmarkCreatedAt < @1", [from, to]);
                }
                else if (searchValue.Length == 7)
                {
                    DateTimeOffset from = new DateTimeOffset(new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(5, 2)), 1));
                    DateTimeOffset to = new DateTimeOffset(new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(5, 2)), 31));

                    return ("BookmarkCreatedAt > @0 && BookmarkCreatedAt < @1", [from, to]);
                }
                else if (searchValue.Length == 10)
                {
                    DateTimeOffset exact = new DateTimeOffset(new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(5, 2)), int.Parse(searchValue.Substring(8, 2))));

                    return ("BookmarkCreatedAt == @0", [exact]);
                }
                else if (searchValue.Length == 11)
                {
                    DateTimeOffset exact = new DateTimeOffset(new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(5, 2)), int.Parse(searchValue.Substring(8, 2))));

                    return ("BookmarkCreatedAt @0 @1", [searchValue[10], exact]);
                }

                break;
            case FilterBookmarksEnum.url:

                return ("WebsiteUrl.Contains(@0)", [searchValue!]);

            case FilterBookmarksEnum.info:

                return ("Title.Contains(@0) or Description.Contains(@0)", [searchValue!]);

        }

        // No found Enum matched value
        throw new ManagerException("Invalid filter format");
    }

}
