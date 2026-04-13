using MediatR;
using Shared.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Features.Notifications;

public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateNotificationCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        var entry = new Shared.Infrastructure.Entities.Notification { Id = Guid.NewGuid(), UserId = request.UserId, Message = request.Message };
        _db.Notifications.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetNotificationByIdHandler : IRequestHandler<GetNotificationByIdQuery, Shared.Infrastructure.Entities.Notification?>
{
    private readonly PeakMindDbContext _db;
    public GetNotificationByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Shared.Infrastructure.Entities.Notification?> Handle(GetNotificationByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Notifications.FirstOrDefaultAsync(n => n.Id == request.Id, cancellationToken);
    }
}
