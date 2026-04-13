using MediatR;

namespace Features.CheckIns;

public record CreateCheckInCommand(Guid UserId, string Notes) : IRequest<Guid>;
