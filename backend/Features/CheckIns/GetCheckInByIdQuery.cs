using backend.Features.CheckIns;
using MediatR;

namespace Features.CheckIns;

public record GetCheckInByIdQuery(
    Guid Id
    ) : IRequest<CheckInDto?>;
public record GetUserCheckInsQuery(
    Guid UserId,
    int? Days = null
) : IRequest<List<CheckInDto>>;
