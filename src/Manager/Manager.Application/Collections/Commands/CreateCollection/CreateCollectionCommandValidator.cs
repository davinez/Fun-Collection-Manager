using FluentValidation;

namespace Manager.Application.Collections.Commands.CreateCollection;

public class CreateCollectionCommandValidator : AbstractValidator<CreateCollectionCommand>
{
    public CreateCollectionCommandValidator()
    {
        RuleFor(v => v.Name)
            .NotEmpty()
            .WithMessage("Name is required.");

        RuleFor(v => v.Icon)
           .NotEmpty()
           .WithMessage("Icon is required.");

        RuleFor(v => v.GroupId)
           .NotEmpty()
           .WithMessage("'{PropertyName}' invalid format");

        RuleFor(x => x.ParentCollectionId)
             .Must(ValidFormatIfNotNull)
             .WithMessage("'{PropertyName}' invalid format");
    }

    public static bool ValidFormatIfNotNull(int? value)
    {
        return value == null || value > 1;
    }
}
