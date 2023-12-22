using TV_IDP.Models.Hub;
using TV_IDP.Utils;

namespace TV_IDP.Services;

public sealed class Connections
{
    private static readonly List<HubConnection> connections = new();

    public void AddUser(HubConnection user)
    {
        lock (connections)
        {
            connections.Add(user);
        }
    }

    public void RemoveUser(string connectionId)
    {
        lock (connections)
        {
            connections.RemoveAll(user => user.ConnectionId == connectionId);
        }
    }

    public List<HubConnection> GetConnections()
    {
        return connections;
    }

    public HubConnection GetConnectedUser(string connectionId)
    {
        lock (connections)
        {
            var user = connections.Find(user => user.ConnectionId == connectionId);

            if (user is null)
            {
                throw new CustomException("User not found");
            }

            return user;
        }
    }

    public string GetUserConnectionId(int userId)
    {
        lock (connections)
        {
            var user = connections.Find(user => user.Id == userId);

            if (user is null)
            {
                throw new CustomException("User not found");
            }

            return user.ConnectionId;
        }
    }
}