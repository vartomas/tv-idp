using TV_IDP.Models;

namespace TV_IDP.Hubs;

public static class HubConnections
{
    private static readonly List<HubConnection> connections = new();

    public static void AddUser(HubConnection user)
    {
        lock (connections)
        {
            connections.Add(user);
        }
    }

    public static void RemoveUser(string connectionId)
    {
        lock (connections)
        {
            connections.RemoveAll(user => user.ConnectionId == connectionId);
        }
    }

    public static List<HubConnection> GetConnections()
    {
        return connections;
    }
}