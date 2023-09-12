namespace TV_IDP.Hubs;

public static class HubChannels
{
    private static readonly Dictionary<int, List<int>> _channels = new();

    public static void AddUserToChannel(int channelId, int userId)
    {
        if (!_channels.ContainsKey(channelId))
        {
            _channels[channelId] = new List<int>();
        }

        _channels[channelId].Add(userId);
    }

    public static void RemoveUserFromChannel(int channelId, int userId)
    {
        if (!_channels.ContainsKey(channelId))
        {
            return;
        }

        _channels[channelId].Remove(userId);
    }

    public static List<int> GetUsersInChannel(int channelId)
    {
        if (!_channels.ContainsKey(channelId))
        {
            return new List<int>();
        }

        return _channels[channelId];
    }
}