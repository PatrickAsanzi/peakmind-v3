using MediatR;

namespace Features.Notifications;

public record CreateNotificationCommand(Guid UserId, string Message) : IRequest<Guid>;
