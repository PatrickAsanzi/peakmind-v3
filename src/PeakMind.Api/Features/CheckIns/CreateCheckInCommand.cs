using MediatR;

namespace PeakMind.Api.Features.CheckIns;

public record CreateCheckInCommand(Guid UserId, string Notes) : IRequest<Guid>;
