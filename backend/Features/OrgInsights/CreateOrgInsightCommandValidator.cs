using FluentValidation;

namespace Features.OrgInsights;

public class CreateOrgInsightCommandValidator : AbstractValidator<CreateOrgInsightCommand>
{
    public CreateOrgInsightCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Summary).NotEmpty();
    }
}
