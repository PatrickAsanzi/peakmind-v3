using FluentValidation;

namespace PeakMind.Api.Features.Auth;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Name).MaximumLength(200);
    }
}
