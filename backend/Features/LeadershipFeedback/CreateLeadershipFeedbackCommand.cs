using MediatR;

namespace Features.LeadershipFeedback;

public record CreateLeadershipFeedbackCommand(Guid FromUserId, Guid ToUserId, string Feedback) : IRequest<Guid>;
