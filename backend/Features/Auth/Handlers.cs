using MediatR;
using Microsoft.AspNetCore.Identity;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;

namespace Features.Auth;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
{
    private readonly UserManager<User> _userManager;

    public RegisterUserCommandHandler(UserManager<User> userManager) => _userManager = userManager;

    public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User { Id = Guid.NewGuid(), Email = request.Email, UserName = request.Email, Name = request.Name };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new Exception($"Failed to create user: {errors}");
        }

        return user.Id;
    }
}

public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, TokenResponse>
{
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly Shared.Infrastructure.Jwt.IJwtTokenService _tokenService;

    public LoginUserCommandHandler(SignInManager<User> signInManager, UserManager<User> userManager, Shared.Infrastructure.Jwt.IJwtTokenService tokenService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<TokenResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
            throw new Exception("Invalid credentials");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            throw new Exception("Invalid credentials");

        var token = _tokenService.CreateToken(user);
        return new TokenResponse(token, DateTime.UtcNow.AddMinutes(int.Parse("60")));
    }
}

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, User?>
{
    private readonly UserManager<User> _userManager;
    public GetUserByIdHandler(UserManager<User> userManager) => _userManager = userManager;

    public async Task<User?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return await _userManager.FindByIdAsync(request.Id.ToString());
    }
}
