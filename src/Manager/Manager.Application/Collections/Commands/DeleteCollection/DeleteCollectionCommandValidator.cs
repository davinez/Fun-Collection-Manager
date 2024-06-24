using FluentValidation;

namespace Manager.Application.Collections.Commands.DeleteCollection;

public class DeleteCollectionCommandValidator : AbstractValidator<DeleteCollectionCommand>
{
    public DeleteCollectionCommandValidator()
    {
        RuleFor(v => v.CollectionId)
            .NotEmpty()
            .WithMessage("CollectionId is required.");
    }
}

