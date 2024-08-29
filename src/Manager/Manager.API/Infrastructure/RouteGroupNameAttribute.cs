using System;

namespace Manager.API.Infrastructure;

public class RouteGroupNameAttribute : Attribute
{
    public string Name { get; set; }

    public RouteGroupNameAttribute(string name)
    {
        Name = name;
    }
}
