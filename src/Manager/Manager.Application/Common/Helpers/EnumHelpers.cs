using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;

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
}
