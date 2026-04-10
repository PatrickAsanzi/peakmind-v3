using MediatR;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Features.Community;

public record GetCommunityByIdQuery(Guid Id) : IRequest<Community?>;
