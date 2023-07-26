namespace TV_IDP.Services;

using Azure;
using Azure.Core;
using Microsoft.Net.Http.Headers;
using System.Net;
using TV_IDP.Access.Models;
using TV_IDP.Authorization;
using TV_IDP.Models;

public interface IUserService
{
    AuthenticateResponse? LogIn(UserDto request);
    AuthenticateResponse? Create(UserDto request);
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

    public AuthenticateResponse? LogIn(UserDto request)
    {
        var user = _context.Users.FirstOrDefault(user => user.Username == request.Username);
        if (user == null) return null;
        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!passwordValid) return null;
        var token = _jwtUtils.GenerateJwtToken(user);

        return new AuthenticateResponse(user, token);
    }

    public AuthenticateResponse? Create(UserDto request)
    {
        var foundUser = _context.Users.FirstOrDefault(user => user.Username == request.Username);
        if (foundUser != null) return null;
        var user = new User
        {
            Username = request.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        _context.SaveChanges();
        var token = _jwtUtils.GenerateJwtToken(user);
        return new AuthenticateResponse(user, token);
    }

    public User? GetById(int id)
    {
        return _context.Users.Find(id);
    }
}