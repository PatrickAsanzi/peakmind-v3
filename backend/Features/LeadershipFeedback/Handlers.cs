using MediatR;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Features.LeadershipFeedback;

public class CreateLeadershipFeedbackCommandHandler : IRequestHandler<CreateLeadershipFeedbackCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateLeadershipFeedbackCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateLeadershipFeedbackCommand request, CancellationToken cancellationToken)
    {
        var entry = new Shared.Infrastructure.Entities.LeadershipFeedback { Id = Guid.NewGuid(), FromUserId = request.FromUserId, ToUserId = request.ToUserId, Feedback = request.Feedback };
        _db.LeadershipFeedbacks.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetLeadershipFeedbackByIdHandler : IRequestHandler<GetLeadershipFeedbackByIdQuery, Shared.Infrastructure.Entities.LeadershipFeedback?>
{
    private readonly PeakMindDbContext _db;
    public GetLeadershipFeedbackByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Shared.Infrastructure.Entities.LeadershipFeedback?> Handle(GetLeadershipFeedbackByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.LeadershipFeedbacks.FirstOrDefaultAsync(f => f.Id == request.Id, cancellationToken);
    }
}
