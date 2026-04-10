using MediatR;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Features.CheckIns;

public record GetCheckInByIdQuery(Guid Id) : IRequest<CheckIn?>;
