using FluentValidation;

namespace Features.CheckIns;

public class CreateCheckInCommandValidator : AbstractValidator<CreateCheckInCommand>
{
    public CreateCheckInCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters.");

        RuleFor(x => x.Responses)
            .NotEmpty()
            .WithMessage("At least one response is required.")
            .Must(r => r.Count <= 20)
            .WithMessage("Cannot submit more than 20 responses.");

        RuleForEach(x => x.Responses).ChildRules(response =>
        {
            response.RuleFor(r => r.Key)
                .NotEmpty()
                .WithMessage("Response key is required.")
                .MaximumLength(100)
                .WithMessage("Response key cannot exceed 100 characters.");

            response.RuleFor(r => r.Value)
                .InclusiveBetween(1, 5)
                .WithMessage("Response value must be between 1 and 5.");

            response.RuleFor(r => r.Emoji)
                .MaximumLength(10)
                .WithMessage("Emoji cannot exceed 10 characters.");
        });
    }
}