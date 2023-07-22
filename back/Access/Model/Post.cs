namespace TV_IDP.Access.Model
{
    public class Post
    {
        public int Id { get; set; }

        public required string Title { get; set; }

        public required string Body { get; set; }

        public bool IsPublished { get; set; }
    }
}
