namespace TV_IDP.Hubs;

public static class HubConnections
{
    private static readonly List<string> connections = new();

    public static void AddUser(string user)
    {
        lock (connections)
        {
            connections.Add(user);
        }
    }

    public static void RemoveUser(string user)
    {
        lock (connections)
        {
            connections.Remove(user);
        }
    }

    public static List<string> GetConnections()
    {
        return connections;
    }
}