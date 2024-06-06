using FluentValidation;

namespace Manager.Application.CollectionsGroups.Commands.CreateCollectionGroup;

public class CreateCollectionGroupCommandValidator : AbstractValidator<CreateCollectionGroupCommand>
{
    public CreateCollectionGroupCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(100)
            .NotEmpty();
    }
}
