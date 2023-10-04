using TV_IDP.Access.Models;
using TV_IDP.Models;
using TV_IDP.Models.Chat;
using TV_IDP.Models.Hub;

namespace TV_IDP.Services;

public sealed class Channels
{
    private readonly Connections _connections;

    public Channels(Connections connections)
    {
        _connections = connections;
    }

    private static readonly Dictionary<int, List<int>> channels = new();

    public void AddUserToChannel(int channelId, int userId)
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

    public void RemoveUserFromChannel(int channelId, int userId)
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

    public ChannelUsers GetChannelUsers(int channelId)
    {
        if (!channels.ContainsKey(channelId))
        {
            return new ChannelUsers();
        }

        var connections = _connections.GetConnections();
        var userIds = channels[channelId];

        return new ChannelUsers
        {
            ChannelId = channelId,
            Users = connections.FindAll(connection => userIds.Contains(connection.Id)).Select(user => new ConnectedUser() { Id = user.Id, Username = user.Username }).ToList()
        };
    }
}