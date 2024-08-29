using FluentValidation;

namespace Manager.Application.Bookmarks.Commands.DeleteBookmarks;
internal class DeleteBookmarksCommandValidator : AbstractValidator<DeleteBookmarksCommand>
{
    public DeleteBookmarksCommandValidator()
    {
        RuleFor(v => v.BookmarkIds)
            .NotEmpty()
            .WithMessage("Bookmarks Id(s) are required.");
    }
}
