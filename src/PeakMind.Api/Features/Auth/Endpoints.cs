using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace PeakMind.Api.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/users", async (IMediator mediator, CreateUserCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/auth/users/{id}", id);
        });

        group.MapGet("/users/{id}", async (IMediator mediator, Guid id) =>
        {
            var user = await mediator.Send(new GetUserByIdQuery(id));
            return user is not null ? Results.Ok(user) : Results.NotFound();
        });
    }
}
