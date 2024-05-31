using System;
using System.Threading.Tasks;
using Azure.Identity;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace Manager.Infrastructure.Services;

public class MicrosoftGraphService : IMicrosoftGraphService
{
    private readonly GraphServiceClient _graphServiceClient;

    public MicrosoftGraphService(IConfiguration configuration)
    {
        // The client credentials flow requires that you request the
        // /.default scope, and pre-configure your permissions on the
        // app registration in Azure. An administrator must grant consent
        // to those permissions beforehand.
        var scopes = configuration.GetValue<string[]>("AzureAD:ManagerApp:Scopes");

        // Values from app registration
        string clientId = configuration["AzureAD:ManagerApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");
        string tenantId = configuration["AzureAD:ManagerApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");
        string clientSecret = configuration["AzureAD:ManagerApp:ClientId"] ?? throw new ManagerException($"Empty config section in {nameof(MicrosoftGraphService)}");

        // using Azure.Identity;
        var options = new ClientSecretCredentialOptions
        {
            AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
        };

        var clientSecretCredential = new ClientSecretCredential(
            tenantId, clientId, clientSecret, options);

        _graphServiceClient = new GraphServiceClient(clientSecretCredential, scopes);
    }

    public async Task<bool> AssignRoleToUser(string userId)
    {
        var requestBody = new AppRoleAssignment
        {
            PrincipalId = Guid.Parse(userId),
            ResourceId = Guid.Parse("8e881353-1735-45af-af21-ee1344582a4d"),
            AppRoleId = Guid.Parse("00000000-0000-0000-0000-000000000000"),
        };

        // To initialize your graphClient, see https://learn.microsoft.com/en-us/graph/sdks/create-client?from=snippets&tabs=csharp
        AppRoleAssignment? result = await _graphServiceClient.Users["{user-id}"].AppRoleAssignments.PostAsync(requestBody);

        // TODO: Check different way of validate success
        return result != null;
    }
}
