using System;

namespace Manager.Application.Common.Exceptions;

public class RemoteServiceException : Exception
{
    public RemoteServiceException(string remoteServceName, string exceptionMessage)
        : base($"Remote Service \"{remoteServceName}\" failed with message {exceptionMessage}")
    {
    }
}
