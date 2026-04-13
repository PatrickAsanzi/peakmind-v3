using FluentValidation;

namespace Features.Appointments;

public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
{
    public CreateAppointmentCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.StartsAt).LessThan(x => x.EndsAt).WithMessage("StartsAt must be before EndsAt");
        RuleFor(x => x.Title).NotEmpty();
    }
}
