using TV_IDP.Models.Hub;

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
}