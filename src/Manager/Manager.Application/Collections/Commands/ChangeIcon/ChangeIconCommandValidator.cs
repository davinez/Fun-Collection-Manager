using System;
using FluentValidation;

namespace Manager.Application.Collections.Commands.ChangeIcon;

public class ChangeIconCommandValidator : AbstractValidator<ChangeIconCommand>
{
    public ChangeIconCommandValidator()
    {
        RuleFor(v => v.CollectionId)
            .NotEmpty()
            .WithMessage("CollectionId is required.");

        RuleFor(v => v.IconURL)
            .NotEmpty()
            .WithMessage("IconURL is required.");

        RuleFor(v => new { v.IsDefaultIcon, v.IconURL })
            .Must(x => ValidURLFormat(x.IsDefaultIcon, x.IconURL))
            .WithMessage("Invalid IconURL");

    }

    public static bool ValidURLFormat(bool isDefaultIcon, string iconUrl)
    {
        if (!isDefaultIcon)
        {
            bool result = Uri.TryCreate(iconUrl, UriKind.Absolute, out var uriResult) &&
                        (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

            return result;
        }

        return true;
    }

}

