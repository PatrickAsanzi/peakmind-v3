using MediatR;

namespace Features.LeadershipFeedback;

public record GetLeadershipFeedbackByIdQuery(Guid Id) : IRequest<Shared.Infrastructure.Entities.LeadershipFeedback?>;
