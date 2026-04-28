using backend.Features.CheckIns;
using MediatR;

namespace Features.CheckIns;

public record UpdateCheckInCommand(Guid Id, CreateCheckInDto Dto) : IRequest<bool>;
