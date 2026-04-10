using MediatR;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace PeakMind.Api.Features.Articles;

public class CreateArticleCommandHandler : IRequestHandler<CreateArticleCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateArticleCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        var entry = new Article { Id = Guid.NewGuid(), Title = request.Title, Content = request.Content };
        _db.Articles.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetArticleByIdHandler : IRequestHandler<GetArticleByIdQuery, Article?>
{
    private readonly PeakMindDbContext _db;
    public GetArticleByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Article?> Handle(GetArticleByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Articles.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
    }
}
