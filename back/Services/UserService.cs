namespace TV_IDP.Services;

using Microsoft.EntityFrameworkCore;
using TV_IDP.Access;
using TV_IDP.Access.Models;
using TV_IDP.Authorization;
using TV_IDP.Models;

public interface IUserService
{
    AuthenticateResponse? LogIn(UserDto model);
    AuthenticateResponse? Create(UserDto model);
    IEnumerable<User> GetAll();
    User? GetById(int id);
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

    public AuthenticateResponse? LogIn(UserDto model)
    {
        var user = _context.Users.Find(model.Username);
        if (user == null) return null;
        var token = _jwtUtils.GenerateJwtToken(user);
        return new AuthenticateResponse(user, token);
    }

    public AuthenticateResponse? Create(UserDto model)
    {
        var user = _context.Users.Find(model.Username);
        if (user != null) return null;
        user = new User
        {
            Username = model.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(model.Password)
        };

        _context.Users.Add(user);
        _context.SaveChanges();
        var token = _jwtUtils.GenerateJwtToken(user);
        return new AuthenticateResponse(user, token);
    }

    public IEnumerable<User> GetAll()
    {
        return _context.Users;
    }

    public User? GetById(int id)
    {
        return _context.Users.Find(id);
    }
}