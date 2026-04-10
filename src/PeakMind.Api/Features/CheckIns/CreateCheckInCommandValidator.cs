using FluentValidation;

namespace PeakMind.Api.Features.CheckIns;

public class CreateCheckInCommandValidator : AbstractValidator<CreateCheckInCommand>
{
    public CreateCheckInCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}
