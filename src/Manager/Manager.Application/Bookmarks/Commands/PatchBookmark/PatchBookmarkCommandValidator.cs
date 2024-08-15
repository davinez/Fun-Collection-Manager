using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Manager.Application.Bookmarks.Commands.PatchBookmark;

public class PatchBookmarkCommandValidator : AbstractValidator<PatchBookmarkCommand>
{
    private readonly string[] ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    public PatchBookmarkCommandValidator()
    {
        RuleFor(v => v.BookmarkId)
            .NotEmpty()
            .WithMessage("BookmarkId is required.");

        RuleFor(v => v.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(100)
            .WithMessage("Title is too large");

        RuleFor(v => v.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MaximumLength(255)
            .WithMessage("Description is too large");

        RuleFor(v => v.WebsiteURL)
            .NotEmpty()
            .WithMessage("WebsiteURL is required.")
            .MaximumLength(2048)
            .WithMessage("WebsiteURL is too large");

        RuleFor(x => x.WebsiteURL)
              .Must(ValidURLFormat)
              .WithMessage("WebsiteURL invalid format");

        RuleFor(x => x.Cover)
              .Must(ValidCoverFile)
              .WithMessage("Cover invalid format");
    }

    public static bool ValidURLFormat(string newUrl)
    {
        bool result = Uri.TryCreate(newUrl, UriKind.Absolute, out var uriResult) &&
                    (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

        return result;
    }

    // Optional property, only validate if is not null-empty
    public bool ValidCoverFile(IFormFile? cover)
    {
        if (cover == null)
            return true;

        if (ACCEPTED_IMAGE_TYPES.Contains(cover.ContentType) &&
            BytesToMegaBytes(cover.Length) <= 4)
        {
            return true;
        }

        return false;
    }

    private static long BytesToMegaBytes(long sizeInBytes)
    {
        return sizeInBytes / (1024 * 1024);
    }

}
