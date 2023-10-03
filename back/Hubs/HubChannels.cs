namespace TV_IDP.Hubs;

public static class HubChannels
{
    private static readonly Dictionary<int, List<int>> channels = new();

    public static void AddUserToChannel(int channelId, int userId)
    {
        if (!channels.ContainsKey(channelId))
        {
            channels[channelId] = new List<int>();
        }

        lock (channels)
        {
            channels[channelId].Add(userId);
        }
    }

    public static void RemoveUserFromChannel(int channelId, int userId)
    {
        if (!channels.ContainsKey(channelId))
        {
            return;
        }

        lock (channels)
        {
            channels[channelId].Remove(userId);
        }
    }

    public static List<int> GetUsersInChannel(int channelId)
    {
        if (!channels.ContainsKey(channelId))
        {
            return new List<int>();
        }

        return channels[channelId];
    }
}