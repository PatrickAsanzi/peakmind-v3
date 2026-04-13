using MediatR;

namespace Features.Community;

public record CreateCommunityCommand(string Name, string Description) : IRequest<Guid>;
