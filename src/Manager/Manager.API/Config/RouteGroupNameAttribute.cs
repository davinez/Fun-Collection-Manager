using System;

namespace Manager.API.Config;

public class RouteGroupNameAttribute : Attribute
{
    public string Name { get; set; }

    public RouteGroupNameAttribute(string name)
    {
        Name = name;
    }
}
