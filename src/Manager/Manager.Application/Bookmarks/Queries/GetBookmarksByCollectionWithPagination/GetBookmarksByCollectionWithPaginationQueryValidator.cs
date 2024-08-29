using System;
using System.Linq;
using FluentValidation;
using Manager.Application.Common.Enums;

namespace Manager.Application.Bookmarks.Queries.GetBookmarksByCollectionWithPagination;

public class GetBookmarksByCollectionWithPaginationQueryValidator : AbstractValidator<GetBookmarksByCollectionWithPaginationQuery>
{
    private readonly char[] _chars = { '>', '<', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

    public GetBookmarksByCollectionWithPaginationQueryValidator()
    {
        RuleFor(x => x.CollectionId)
            .GreaterThanOrEqualTo(1).WithMessage("CollectionId at least greater than or equal to 1.");

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Page number at least greater than or equal to 1.");

        RuleFor(x => x.PageLimit)
            .GreaterThanOrEqualTo(1).WithMessage("Page limit at least greater than or equal to 1.");

        // If FilterType is sent then search value cant be null/empty
        RuleFor(o => o)
          .Must(BeValidSearchValue)
          .WithMessage("Invalid search value format")
          // The validator will only be executed if the result of the lambda returns true.
          .When(p => p.FilterType != null);
    }

    public bool BeValidSearchValue(GetBookmarksByCollectionWithPaginationQuery query)
    {
        if (string.IsNullOrWhiteSpace(query.SearchValue))
        {
            return false;
        }

        if (query.FilterType == FilterBookmarksEnum.creationDate)
        {
            if (!OnlyAllowedChars(query.SearchValue!))
                return false;

            // max lenght ">YYYY-MM-DD"
            if (query.SearchValue.Length > 11)
                return false;

            // Lenght 4 => YYYY
            // Lenght 7 => YYYY-MM
            // Lenght 10 => YYYY-MM-DD
            // Lenght 11 => >YYYY-MM-DD or <YYYY-MM-DD

            if (query.SearchValue!.Length == 4)
            {
                if (int.TryParse(query.SearchValue, out int year))
                {
                    // you know that the parsing attempt was successful
                    return true;
                }
                else
                {
                    return false; // Invalid format
                }
            }
            else if (query.SearchValue!.Length == 7)
            {
                if (int.TryParse(query.SearchValue.Substring(0, 4), out int year) &&
                    int.TryParse(query.SearchValue.Substring(5, 2), out int month))
                {
                    return month >= 1 && month <= 12;
                }
                else
                {
                    return false; // Invalid format
                }
            }
            else if (query.SearchValue!.Length == 10)
            {
                if (
                    int.TryParse(query.SearchValue.Substring(0, 4), out int year) &&
                    int.TryParse(query.SearchValue.Substring(5, 2), out int month) &&
                    int.TryParse(query.SearchValue.Substring(8, 2), out int day)
                    )
                {
                    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
                }
                else
                {
                    return false; // Invalid format
                }
            }
            else if (query.SearchValue!.Length == 11)
            {
                char[] comparisonChars = { '>', '<' };

                if (
                    int.TryParse(query.SearchValue.Substring(0, 4), out int year) &&
                    int.TryParse(query.SearchValue.Substring(5, 2), out int month) &&
                    int.TryParse(query.SearchValue.Substring(8, 2), out int day) &&
                    comparisonChars.Contains(query.SearchValue[10])
                    )
                {
                    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
                }
                else
                {
                    return false; // Invalid format
                }
            }
            // Not valid lenght if FilterBookmarksEnum.creationDate selected
            else
            {
                return false;
            }

        }
        else if (query.FilterType == FilterBookmarksEnum.info || query.FilterType == FilterBookmarksEnum.url)
        {
            // Limit lenght in search bar
            return query.SearchValue!.Length <= 255;
        }

        return false;
    }

    private bool OnlyAllowedChars(string str)
    {
        foreach (char c in str)
        {
            if (!_chars.Contains(c))
                return false;
        }

        return true;
    }
}

