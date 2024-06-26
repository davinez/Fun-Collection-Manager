using FluentValidation;

namespace Manager.Application.CollectionGroups.Commands.UpdateCollectionGroup;

public class PatchCollectionGroupCommandValidator : AbstractValidator<PatchCollectionGroupCommand>
{
    public PatchCollectionGroupCommandValidator()
    {
        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithMessage("GroupId is required.");

        RuleFor(v => v.GroupName)
           .NotEmpty()
           .WithMessage("GroupName is required.");
    }
}
