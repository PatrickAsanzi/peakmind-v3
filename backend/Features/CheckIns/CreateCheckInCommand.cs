using backend.Features.CheckIns;
using MediatR;

namespace Features.CheckIns;

public record CreateCheckInCommand(
    Guid UserId,
    string Notes,
    List<CreateCheckInResponseDto> Responses
) : IRequest<Guid>;
