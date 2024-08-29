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
           .Must(p => p == null)
           .WithMessage("Icon is not required on creation step");

        RuleFor(v => v.GroupId)
           .NotEmpty()
           .WithMessage("'{PropertyName}' invalid format");

        RuleFor(x => x.ParentCollectionId)
             .Must(ValidFormatIfNotNull)
             .WithMessage("'{PropertyName}' invalid format");
    }

    public static bool ValidFormatIfNotNull(int? value)
    {
        if (value != null && value > 0)
        {
            return true;
        }
        else if (value == null)
        {
            return true;
        }

        return false;
    }
}
