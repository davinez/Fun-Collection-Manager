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

    public static (string, object[]) GetFilterBookmarkValue(FilterBookmarksEnum filterType, string searchValue)
    {

        switch (filterType)
        {
            case FilterBookmarksEnum.creationDate:

                // Lenght 4 => YYYY
                // Lenght 7 => YYYY-MM
                // Lenght 10 => YYYY-MM-DD
                // Lenght 11 => >YYYY-MM-DD or <YYYY-MM-DD

                if (searchValue.Length == 4)
                {
                    return ("created > @0 &&  created < @1", new object[] { new DateTime(int.Parse(searchValue), 1, 1), new DateTime(int.Parse(searchValue), 12, 31) });
                }
                else if (searchValue.Length == 7)
                {
                    return ("created > @0 &&  created < @1", new object[] {
                        new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(6, 2)), 1),
                       new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(6, 2)), 31),
                    });
                }
                else if (searchValue.Length == 10)
                {
                    return ("created == @0", new object[] {
                        new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(6, 2)), int.Parse(searchValue.Substring(9, 2)))
                    });
                }
                else if (searchValue.Length == 11)
                {
                    return ("created @0 @1", new object[] {
                        searchValue[11],
                        new DateTime(int.Parse(searchValue.Substring(0, 4)), int.Parse(searchValue.Substring(6, 2)), int.Parse(searchValue.Substring(9, 2)))
                    });
                }

                break;
            case FilterBookmarksEnum.url:

                return ("website_url like '%@0%' ", new object[] {
                        searchValue
                    });
            case FilterBookmarksEnum.info:
                return ("title like '%@0%' ", new object[] {
                        searchValue
                    });

        }

        // No found Enum matched value
        throw new ManagerException("Invalid filter format");
    }

}
