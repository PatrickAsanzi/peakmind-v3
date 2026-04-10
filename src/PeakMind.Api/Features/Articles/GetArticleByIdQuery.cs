using MediatR;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Features.Articles;

public record GetArticleByIdQuery(Guid Id) : IRequest<Article?>;
