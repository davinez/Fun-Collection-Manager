using FluentValidation;

namespace Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;

public class CreateCollectionGroupCommandValidator : AbstractValidator<CreateCollectionGroupCommand>
{
    public CreateCollectionGroupCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(100)
            .NotEmpty()
            .WithMessage("Name is required."); 
    }
}
