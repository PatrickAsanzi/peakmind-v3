using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Features.Dashboard;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/dashboard");

        group.MapGet("/metrics", async (
            [FromQuery] Guid userId,
            [FromQuery] string filter,
            IMediator mediator) =>
        {
            var result = await mediator.Send(new GetDashboardMetricsQuery(userId, filter));
            return Results.Ok(result);
        });
    }
}
