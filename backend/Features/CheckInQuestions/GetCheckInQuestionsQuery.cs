using MediatR;
using Shared.Infrastructure.Entities;

namespace Features.CheckInQuestions;

public record GetCheckInQuestionsQuery : IRequest<List<CheckInQuestion>>;
