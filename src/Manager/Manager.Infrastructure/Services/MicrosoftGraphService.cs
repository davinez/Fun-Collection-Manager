using System;
using System.Linq;
using System.Threading.Tasks;
using Azure.Identity;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Manager.Domain.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace Manager.Infrastructure.Services;

public class MicrosoftGraphService : IMicrosoftGraphService
{
    private readonly GraphServiceClient _graphServiceClient;
    private readonly IConfiguration _configuration;

    public MicrosoftGraphService(IConfiguration configuration)
    {
        // The client credentials flow requires that you request the
        // /.default scope, and pre-configure your permissions on the
        // app registration in Azure. An administrator must grant consent
        // to those permissions beforehand.
        var scopes = configuration.GetValue<string[]>("EntraID:ManagerApiApp:Scopes");

        // Values from app registration
        string clientId = configuration["EntraID:ManagerApiApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");
        string tenantId = configuration["EntraID:ManagerApiApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");
        string clientSecret = configuration["EntraID:ManagerApiApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");

        // using Azure.Identity;
        var options = new ClientSecretCredentialOptions
        {
            AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
        };

        var clientSecretCredential = new ClientSecretCredential(
            tenantId, clientId, clientSecret, options);

        _graphServiceClient = new GraphServiceClient(clientSecretCredential, scopes);
        _configuration = configuration;
    }

    public async Task<bool> AssignRoleToUser(Guid userId)
    {
        string clientId = _configuration["ManagerClientApp:ClientId"] ?? throw new ManagerException("Empty config section in ManagerClientApp:ClientId");
        string clientAppId = _configuration["EntraID:ManagerClientApp:ClientAppId"] ?? throw new ManagerException("Empty config section in ManagerClientApp:ClientAppId");

        var clientApp = await _graphServiceClient.Applications[clientAppId].GetAsync() ?? throw new ManagerException($"Error in get clientApp with ID {clientAppId}");

        Guid defaultRoleAppId = (
            (clientApp.AppRoles ?? throw new ManagerException($"Error in get app roles of clientApp with ID {clientAppId}"))
            .FirstOrDefault(r => string.Compare(r.Value, Roles.GeneralLevel1, StringComparison.OrdinalIgnoreCase) == 0) ?? throw new ManagerException($"Error in get app role of clientApp with ID {clientAppId}")
            ).Id ?? throw new ManagerException($"Error in get app role ID of clientApp with ID {clientAppId}");

        // TODO: Dont assign defult role if already user has it
        // To ensure complete results for users with many indirect app role assignments

        var userRoles = await _graphServiceClient.Users[userId.ToString()].AppRoleAssignments.GetAsync((requestConfiguration) =>
        {
            requestConfiguration.QueryParameters.Count = true;
            requestConfiguration.Headers.Add("ConsistencyLevel", "eventual");
        });

        bool roleExists = userRoles == null ?
            false : userRoles.Value == null ?
            false : userRoles.Value.FirstOrDefault(r => r.AppRoleId == defaultRoleAppId) == null ?
            false : true;

        if (roleExists)
            return true;

        var requestBody = new AppRoleAssignment
        {
            PrincipalId = userId,
            ResourceId = Guid.Parse(clientId),
            AppRoleId = defaultRoleAppId,
        };

        // To initialize your graphClient, see https://learn.microsoft.com/en-us/graph/sdks/create-client?from=snippets&tabs=csharp
        AppRoleAssignment? result = await _graphServiceClient.Users[userId.ToString()].AppRoleAssignments.PostAsync(requestBody);

        // TODO: Check different way of validate success
        return result != null;
    }

    public async Task<User> GetUserById(Guid userId)
    {
        return await _graphServiceClient.Users[userId.ToString()].GetAsync() ?? throw new ManagerException($"Error in get Entra User with ID {userId}");

    }
}
