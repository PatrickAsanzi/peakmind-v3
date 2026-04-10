using MediatR;

namespace PeakMind.Api.Features.Articles;

public record CreateArticleCommand(string Title, string Content) : IRequest<Guid>;
