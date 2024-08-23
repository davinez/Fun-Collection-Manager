using System;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;

namespace Manager.API.Services;

/// <summary>
/// With public static MicrosoftIdentityWebApiAuthenticationBuilder AddMicrosoftIdentityWebApi
/// it validates the token and populates the User
/// object within HttpContext with claims extracted from the token.
/// These claims contain information about the user, including the IsAuthenticated property.
/// </summary>
public class CurrentUser : IUser
{
    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        bool isAuthenticated = httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

        if (!isAuthenticated)
            throw new UnauthorizedAccessException("IsAuthenticated: In CurrentUser service");

        string? objectId = httpContextAccessor.HttpContext?.User.GetObjectId();
        string? tenantId = httpContextAccessor.HttpContext?.User.GetTenantId();

        // Use of oid and tid claims
        if (string.IsNullOrWhiteSpace(objectId) || string.IsNullOrWhiteSpace(tenantId))
            throw new UnauthorizedAccessException("HomeAccountId validation fail in CurrentUser service");

        HomeAccountId = objectId + "." + tenantId;
    }

    /// <summary>
    /// In MSAL SDK, homeAccountId corresponds to "oid.tid"
    /// 
    /// oid claim: The immutable identifier for the requestor, which is the verified identity of the user or service principal. 
    /// This ID uniquely identifies the requestor across applications. 
    /// Two different applications signing in the same user receive the same value in the oid claim. 
    ///  
    /// tid claim: Represents the tenant that the user is signing in to. For work and school accounts, 
    /// the GUID is the immutable tenant ID of the organization that the user is signing in to. 
    /// For sign-ins to the personal Microsoft account tenant (services like Xbox, Teams for Life, or Outlook), 
    /// the value is 9188040d-6c67-4c5b-b112-36a304b66dad.
    /// 
    /// https://learn.microsoft.com/en-us/entra/identity-platform/access-token-claims-reference
    /// 
    /// https://stackoverflow.com/questions/73534218/which-azure-ad-property-from-login-response-store-as-userid-in-the-database
    /// </summary>
    public string HomeAccountId { get; }
}
