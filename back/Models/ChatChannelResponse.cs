using TV_IDP.Access.Models;

namespace TV_IDP.Models
{
    public class ChatChannelResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<Message> Messages { get; set; } = new();
    }
}
