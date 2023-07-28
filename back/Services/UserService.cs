namespace TV_IDP.Services;

using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Authorization;
using TV_IDP.Models;

public interface IUserService
{
    Task<AuthenticateResponse?> LogIn(UserDto request);
    Task<AuthenticateResponse?> Create(UserDto request);
    Task<User?> GetById(int id);
}

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IJwtUtils _jwtUtils;

    public UserService(AppDbContext context, IJwtUtils jwtUtils)
    {
        _context = context;
        _jwtUtils = jwtUtils;
    }

    public async Task<AuthenticateResponse?> LogIn(UserDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Username == request.Username);
        if (user == null) return null;
        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!passwordValid) return null;
        var token = _jwtUtils.GenerateJwtToken(user);

        return new AuthenticateResponse(user, token);
    }

    public async Task<AuthenticateResponse?> Create(UserDto request)
    {
        var foundUser = await _context.Users.FirstOrDefaultAsync(user => user.Username == request.Username);
        if (foundUser != null) return null;
        var user = new User
        {
            Username = request.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        var token = _jwtUtils.GenerateJwtToken(user);
        return new AuthenticateResponse(user, token);
    }

    public async Task<User?> GetById(int id)
    {
        return await _context.Users.FindAsync(id);
    }
}