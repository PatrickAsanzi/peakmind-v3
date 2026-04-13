using MediatR;
using Shared.Infrastructure.Entities;

namespace Features.Articles;

public record GetArticleByIdQuery(Guid Id) : IRequest<Article?>;
