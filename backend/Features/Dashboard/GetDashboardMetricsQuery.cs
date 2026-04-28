using MediatR;
using Shared.Infrastructure.Entities;
using Shared.Infrastructure;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Features.Dashboard;

public record GetDashboardMetricsQuery(Guid UserId, string Filter) : IRequest<DashboardMetricDto>;

public class DashboardMetricDto
{
    public string Key { get; set; } = string.Empty;
    public List<int> Values { get; set; } = new();
    public double? Average { get; set; }
}

public class GetDashboardMetricsHandler(PeakMindDbContext _db)
    : IRequestHandler<GetDashboardMetricsQuery, DashboardMetricDto>
{
    public async Task<DashboardMetricDto> Handle(GetDashboardMetricsQuery request, CancellationToken cancellationToken)
    {
        var values = await _db.CheckInResponses
            .Include(r => r.CheckIn)
            .Where(r => r.CheckIn.UserId == request.UserId && r.Key == request.Filter)
            .OrderByDescending(r => r.CheckIn.CreatedAt)
            .Select(r => r.Value)
            .ToListAsync(cancellationToken);

        return new DashboardMetricDto
        {
            Key = request.Filter,
            Values = values,
            Average = values.Any() ? values.Average() : (double?)null,
        };
    }
}
