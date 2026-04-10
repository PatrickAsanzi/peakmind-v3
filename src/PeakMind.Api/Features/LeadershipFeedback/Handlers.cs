using MediatR;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace PeakMind.Api.Features.LeadershipFeedback;

public class CreateLeadershipFeedbackCommandHandler : IRequestHandler<CreateLeadershipFeedbackCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateLeadershipFeedbackCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateLeadershipFeedbackCommand request, CancellationToken cancellationToken)
    {
        var entry = new LeadershipFeedback { Id = Guid.NewGuid(), FromUserId = request.FromUserId, ToUserId = request.ToUserId, Feedback = request.Feedback };
        _db.LeadershipFeedbacks.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetLeadershipFeedbackByIdHandler : IRequestHandler<GetLeadershipFeedbackByIdQuery, LeadershipFeedback?>
{
    private readonly PeakMindDbContext _db;
    public GetLeadershipFeedbackByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<LeadershipFeedback?> Handle(GetLeadershipFeedbackByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.LeadershipFeedbacks.FirstOrDefaultAsync(f => f.Id == request.Id, cancellationToken);
    }
}
