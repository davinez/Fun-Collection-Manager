using FluentValidation;

namespace Manager.Application.CollectionGroups.Commands.CreateCollectionGroup;

public class CreateCollectionGroupCommandValidator : AbstractValidator<CreateCollectionGroupCommand>
{
    public CreateCollectionGroupCommandValidator()
    {
        RuleFor(v => v.GroupName)
            .MaximumLength(100)
            .NotEmpty()
            .WithMessage("GroupName is required."); 
    }
}
