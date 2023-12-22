namespace TV_IDP.Services;

using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Models.Auth;

public interface IUserService
{
    Task<AuthenticateResponse?> LogIn(AuthRequest request);
    Task<AuthenticateResponse?> Create(AuthRequest request);
    Task<User?> GetById(int id);
    User GetCurrentHubUser(HubCallerContext context);
}

public class Users : IUserService
{
    private readonly AppDbContext _db;
    private readonly IJwt _jwt;

    public Users(AppDbContext db, IJwt jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthenticateResponse?> LogIn(AuthRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(user => user.Username == request.Username);
        if (user == null) return null;
        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!passwordValid) return null;
        var token = _jwt.GenerateJwtToken(user);

        var mainChannel = _db.ChatChannels.Include(channel => channel.Users).FirstOrDefault(channel => channel.Id == 21);
        if (mainChannel is not null && !mainChannel.Users.Contains(user))
        {
            mainChannel.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        return new AuthenticateResponse(user, token);
    }

    public async Task<AuthenticateResponse?> Create(AuthRequest request)
    {
        var foundUser = await _db.Users.FirstOrDefaultAsync(user => user.Username == request.Username);
        if (foundUser != null) return null;
        var user = new User
        {
            Username = request.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        var mainChannel = _db.ChatChannels.FirstOrDefault(channel => channel.Id == 21);

        if (mainChannel is not null)
        {
            mainChannel.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var token = _jwt.GenerateJwtToken(user);
        return new AuthenticateResponse(user, token);
    }

    public async Task<User?> GetById(int id)
    {
        return await _db.Users.FindAsync(id);
    }

    public User GetCurrentHubUser(HubCallerContext context)
    {
        if (context.GetHttpContext()?.Items["User"] is not User user)
        {
            throw new Exception("User not found");
        }

        return user;
    }
}