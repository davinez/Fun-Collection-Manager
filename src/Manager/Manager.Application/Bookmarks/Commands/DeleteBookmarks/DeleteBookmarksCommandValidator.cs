using FluentValidation;

namespace Manager.Application.Bookmarks.Commands.DeleteBookmarks;
internal class DeleteBookmarksCommandValidator : AbstractValidator<DeleteBookmarksCommand>
{
    public DeleteBookmarksCommandValidator()
    {
        RuleFor(v => v.BookmarksIds)
            .NotEmpty()
            .WithMessage("Bookmarks Ids are required.");
    }
}
