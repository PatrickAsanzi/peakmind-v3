using FluentValidation;

namespace Features.CheckIns;

public class CreateCheckInCommandValidator : AbstractValidator<CreateCheckInCommand>
{
    public CreateCheckInCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}
