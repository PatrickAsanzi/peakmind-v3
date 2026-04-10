using MediatR;

namespace PeakMind.Api.Features.LeadershipFeedback;

public record CreateLeadershipFeedbackCommand(Guid FromUserId, Guid ToUserId, string Feedback) : IRequest<Guid>;
