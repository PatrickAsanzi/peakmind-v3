using MediatR;

namespace Features.Notifications;

public record GetNotificationByIdQuery(Guid Id) : IRequest<Shared.Infrastructure.Entities.Notification?>;
