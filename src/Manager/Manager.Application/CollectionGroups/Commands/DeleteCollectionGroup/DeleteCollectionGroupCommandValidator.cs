using FluentValidation;

namespace Manager.Application.CollectionGroups.Commands.DeleteCollectionGroup;

public class DeleteCollectionGroupCommandValidator : AbstractValidator<DeleteCollectionGroupCommand>
{
    public DeleteCollectionGroupCommandValidator()
    {
        RuleFor(v => v.GroupId)
            .NotEmpty()
            .WithMessage("GroupId is required.");
    }
}
