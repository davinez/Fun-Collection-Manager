using FluentValidation;

namespace Manager.Application.Collections.Queries.GetCollectionById;

public class GetCollectionByIdQueryValidator : AbstractValidator<GetCollectionByIdQuery>
{
    public GetCollectionByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Id is required.");
    }
}
