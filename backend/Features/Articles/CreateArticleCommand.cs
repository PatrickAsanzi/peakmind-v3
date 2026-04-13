using MediatR;

namespace Features.Articles;

public record CreateArticleCommand(string Title, string Content) : IRequest<Guid>;
