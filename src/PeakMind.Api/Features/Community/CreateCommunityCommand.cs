using MediatR;

namespace PeakMind.Api.Features.Community;

public record CreateCommunityCommand(string Name, string Description) : IRequest<Guid>;
