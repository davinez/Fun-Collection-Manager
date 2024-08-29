using FluentValidation;

namespace Manager.Application.CollectionGroups.Queries.GetCollectionGroupById;

public class GetCollectionGroupByIdQueryValidator : AbstractValidator<GetCollectionGroupByIdQuery>
{
    public GetCollectionGroupByIdQueryValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty()
            .WithMessage("Id is required.");
    }
}
