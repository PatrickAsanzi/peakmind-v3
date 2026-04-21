using MediatR;
using Shared.Infrastructure.Entities;

namespace Features.CheckIns;

public record GetCheckInByIdQuery(
    Guid Id
    ) : IRequest<CheckIn?>;
public record GetUserCheckInsQuery(
    Guid UserId,
    int? Days = null
) : IRequest<List<CheckIn>>;
