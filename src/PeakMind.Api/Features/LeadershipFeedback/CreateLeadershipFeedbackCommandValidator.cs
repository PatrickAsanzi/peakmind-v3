using FluentValidation;

namespace PeakMind.Api.Features.LeadershipFeedback;

public class CreateLeadershipFeedbackCommandValidator : AbstractValidator<CreateLeadershipFeedbackCommand>
{
    public CreateLeadershipFeedbackCommandValidator()
    {
        RuleFor(x => x.FromUserId).NotEmpty();
        RuleFor(x => x.ToUserId).NotEmpty();
        RuleFor(x => x.Feedback).NotEmpty().MaximumLength(2000);
    }
}
