using MediatR;
using Shared.Infrastructure.Entities;

namespace Features.CheckIns;

public record GetCheckInByIdQuery(Guid Id) : IRequest<CheckIn?>;
