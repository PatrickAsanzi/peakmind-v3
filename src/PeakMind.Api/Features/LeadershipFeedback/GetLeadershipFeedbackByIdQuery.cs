using MediatR;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Features.LeadershipFeedback;

public record GetLeadershipFeedbackByIdQuery(Guid Id) : IRequest<LeadershipFeedback?>;
