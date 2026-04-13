using MediatR;

namespace Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/register", async (IMediator mediator, RegisterUserCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/auth/users/{id}", id);
        });

        group.MapPost("/login", async (IMediator mediator, LoginUserCommand command) =>
        {
            var token = await mediator.Send(command);
            return Results.Ok(token);
        });

        group.MapGet("/users/{id}", async (IMediator mediator, Guid id) =>
        {
            var user = await mediator.Send(new GetUserByIdQuery(id));
            return user is not null ? Results.Ok(user) : Results.NotFound();
        });
    }
}
