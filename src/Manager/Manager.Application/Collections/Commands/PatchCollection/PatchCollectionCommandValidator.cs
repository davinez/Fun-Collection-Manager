using FluentValidation;

namespace Manager.Application.Collections.Commands.PatchCollection;

public class PatchCollectionCommandValidator : AbstractValidator<PatchCollectionCommand>
{
    public PatchCollectionCommandValidator()
    {
        RuleFor(v => v.CollectionId)
             .NotEmpty()
             .WithMessage("CollectionId is required.");

        RuleFor(v => v.Name)
            .NotEmpty()
            .WithMessage("Name is required.");

    }

}

