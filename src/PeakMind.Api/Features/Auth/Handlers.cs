using MediatR;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace PeakMind.Api.Features.Auth;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateUserCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User { Id = Guid.NewGuid(), Email = request.Email, Name = request.Name };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);
        return user.Id;
    }
}

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, User?>
{
    private readonly PeakMindDbContext _db;
    public GetUserByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<User?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
    }
}
