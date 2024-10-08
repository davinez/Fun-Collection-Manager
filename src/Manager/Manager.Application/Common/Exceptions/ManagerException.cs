﻿using System;

namespace Manager.Application.Common.Exceptions;

/// <summary>
/// Exception type for domain exceptions
/// </summary>
public class ManagerException : Exception
{
    public ManagerException()
    { }

    public ManagerException(string message)
        : base(message)
    { }

    public ManagerException(string message, Exception innerException)
        : base(message, innerException)
    { }
}
