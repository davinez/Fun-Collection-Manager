using System;
using FluentValidation;
using Manager.Application.Common.Exceptions;
using Microsoft.Extensions.Configuration;

namespace Manager.Application.Collections.Commands.ChangeIcon;

public class ChangeIconCommandValidator : AbstractValidator<ChangeIconCommand>
{
    private readonly IConfiguration _configuration;

    public ChangeIconCommandValidator(IConfiguration configuration)
    {
        _configuration = configuration;

        RuleFor(v => v.CollectionId)
            .NotEmpty()
            .WithMessage("CollectionId is required.");

        RuleFor(v => new { v.IsDefaultIcon, v.IconKey })
            .Must(x =>
            {
                if (x.IsDefaultIcon && x.IconKey != null)
                {
                    return false;
                }
                else if (x.IsDefaultIcon && x.IconKey == null)
                {
                    return true;
                }
                else if (!x.IsDefaultIcon && string.IsNullOrWhiteSpace(x.IconKey))
                {
                    return false;
                }
                else
                {
                    string urlDomain = _configuration["S3Storage:R2DomainService"] ?? throw new ManagerException($"Empty config section in {nameof(ChangeIconCommandValidator)} R2DefaultDomain");
                    return ValidURLFormat(x.IconKey!, urlDomain);
                }
            })
            .WithMessage("Invalid IconKey");

    }

    // urlDomain is only concated to the key to attemp to form and validate a url string,
    // though the real url is the custom domain attached to the icons bucket
    public static bool ValidURLFormat(string iconKey, string urlDomain)
    {
        string fullURL = urlDomain + "/" + iconKey;

        bool result = Uri.TryCreate(fullURL, UriKind.Absolute, out var uriResult) &&
                    (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

        return result;
    }

}

