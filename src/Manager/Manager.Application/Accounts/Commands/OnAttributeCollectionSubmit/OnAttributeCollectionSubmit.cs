using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Manager.Application.Common.Exceptions;
using Manager.Application.Common.Interfaces;
using Manager.Application.Common.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Manager.Application.Accounts.Commands.OnAttributeCollectionSubmit;

public record OnAttributeCollectionSubmitCommand : IRequest<OnAttributeCollectionSubmitDto>
{
    public string Type { get; init; } = string.Empty;
    public string Source { get; init; } = string.Empty;
    public SubmitData Data { get; init; } = new SubmitData();
}

public record SubmitData
{
    [JsonPropertyName("@odata.type")]
    public string ODataType { get; init; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public string AuthenticationEventListenerId { get; set; } = string.Empty;
    public string CustomAuthenticationExtensionId { get; set; } = string.Empty;
    public AuthenticationContext AuthenticationContext { get; set; } = new AuthenticationContext();
    public UserSignUpInfo UserSignUpInfo { get; set; } = new UserSignUpInfo();
}

public class AuthenticationContext
{
    public string CorrelationId { get; set; } = string.Empty;
    public Client Client { get; set; } = new Client();
    public string Protocol { get; set; } = string.Empty;
    public ClientServicePrincipal ClientServicePrincipal { get; set; } = new ClientServicePrincipal();
    public ResourceServicePrincipal ResourceServicePrincipal { get; set; } = new ResourceServicePrincipal();
}

public class UserSignUpInfo
{
    public Attributes Attributes { get; set; } = new Attributes();
    public List<Identity> Identities { get; set; } = new List<Identity>();
}

public class Identity
{
    public string SignInType { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string IssuerAssignedId { get; set; } = string.Empty;
}

public class Client
{
    public string Ip { get; set; } = string.Empty;
    public string Locale { get; set; } = string.Empty;
    public string Market { get; set; } = string.Empty;
}

public class ClientServicePrincipal
{
    public string Id { get; set; } = string.Empty;
    public string AppId { get; set; } = string.Empty;
    public string AppDisplayName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

public class ResourceServicePrincipal
{
    public string Id { get; set; } = string.Empty;
    public string AppId { get; set; } = string.Empty;
    public string AppDisplayName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

public class Attributes
{
    public AccessCode AccessCode { get; set; } = new AccessCode();
    public City City { get; set; } = new City();
    public Country Country { get; set; } = new Country();
    public DisplayName DisplayName { get; set; } = new DisplayName();
    public GivenName GivenName { get; set; } = new GivenName();
    public Email Email { get; set; } = new Email();
    public Surname Surname { get; set; } = new Surname();
}

public class AccessCode
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class City
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class Country
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class DisplayName
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class GivenName
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class Email
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class Surname
{
    public string Value { get; set; } = string.Empty;
    public string AttributeType { get; set; } = string.Empty;
}

public class OnAttributeCollectionSubmitCommandHandler : IRequestHandler<OnAttributeCollectionSubmitCommand, OnAttributeCollectionSubmitDto>
{
    private readonly IManagerContext _context;
    private readonly IMicrosoftGraphService _microsoftGraphService;

    private readonly string _accessCode;

    public OnAttributeCollectionSubmitCommandHandler(IConfiguration configuration, IManagerContext context, IMicrosoftGraphService microsoftGraphService)
    {
        _context = context;
        _microsoftGraphService = microsoftGraphService;
        _accessCode = configuration["AzureAD:ManagerApp:AccessCode"] ?? throw new ManagerException($"Empty config section in access code");
    }

    public Task<OnAttributeCollectionSubmitDto> Handle(OnAttributeCollectionSubmitCommand request, CancellationToken cancellationToken)
    {
        var response = new OnAttributeCollectionSubmitDto()
        {
            Data = new()
            {
                DataType = "microsoft.graph.onAttributeCollectionSubmitResponseData",
            }
        };


        if (!request.Data.UserSignUpInfo.Attributes.AccessCode.Value.Equals(_accessCode, StringComparison.InvariantCulture))
        {
            response.Data.Actions =
            [
                new Action()
                {
                    DataType = "microsoft.graph.attributeCollectionSubmit.showBlockPage",
                    Message = "Incorrect submit. Contact de Administrator"
                }
            ];
        }
        else
        {
            response.Data.Actions =
            [
                new Action()
                {
                    DataType = "microsoft.graph.attributeCollectionSubmit.continueWithDefaultBehavior",
                }
            ];
        }

        return Task.FromResult(response);
    }
}
