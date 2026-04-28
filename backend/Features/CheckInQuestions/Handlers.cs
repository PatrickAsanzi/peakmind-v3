using MediatR;
using Microsoft.EntityFrameworkCore;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;

namespace Features.CheckInQuestions;

public class GetCheckInQuestionsHandler(PeakMindDbContext _db)
    : IRequestHandler<GetCheckInQuestionsQuery, List<CheckInQuestion>>
{
    public async Task<List<CheckInQuestion>> Handle(GetCheckInQuestionsQuery request, CancellationToken cancellationToken)
    {
        return await _db.CheckInQuestions
            .OrderBy(q => q.Order)
            .ToListAsync(cancellationToken);
    }
}
