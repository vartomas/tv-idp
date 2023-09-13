namespace TV_IDP.Models;

public class ChannelUsers
{
    public int ChannelId { get; set; }

    public List<ConnectedUser> Users { get; set; } = new();
}