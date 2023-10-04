using TV_IDP.Models.Hub;

namespace TV_IDP.Models.Chat;

public class ChannelUsers
{
    public int ChannelId { get; set; }

    public List<ConnectedUser> Users { get; set; } = new();
}