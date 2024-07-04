using System;
using FluentValidation;

namespace Manager.Application.Bookmarks.Commands.CreateBookmark;

public class CreateBookmarkCommandValidator : AbstractValidator<CreateBookmarkCommand>
{
    public CreateBookmarkCommandValidator()
    {
        RuleFor(v => v.CollectionId)
            .NotEmpty()
            .WithMessage("CollectionId is required.");

        RuleFor(v => v.NewURL)
            .NotEmpty()
            .WithMessage("NewURL is required.")
            .MaximumLength(255)
            .WithMessage("NewURL is too large");

        RuleFor(x => x.NewURL)
              .Must(ValidURLFormat)
              .WithMessage("'{PropertyName}' invalid format");
    }

    public static bool ValidURLFormat(string newUrl)
    {
        bool result = Uri.TryCreate(newUrl, UriKind.Absolute, out var uriResult) &&
                    (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

        return result;
    }
}

