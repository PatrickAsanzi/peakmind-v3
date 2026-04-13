using Shared.Infrastructure.Entities;

namespace Shared.Infrastructure.Jwt;

public interface IJwtTokenService
{
    string CreateToken(User user);
}
