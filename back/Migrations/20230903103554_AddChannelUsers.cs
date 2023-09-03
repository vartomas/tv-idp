using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TV_IDP.Migrations
{
    /// <inheritdoc />
    public partial class AddChannelUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatChannels_Users_CreatedById",
                table: "ChatChannels");

            migrationBuilder.DropIndex(
                name: "IX_ChatChannels_CreatedById",
                table: "ChatChannels");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "ChatChannels",
                newName: "CreatedByUserId");

            migrationBuilder.CreateTable(
                name: "ChatChannelUser",
                columns: table => new
                {
                    ChannelsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatChannelUser", x => new { x.ChannelsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ChatChannelUser_ChatChannels_ChannelsId",
                        column: x => x.ChannelsId,
                        principalTable: "ChatChannels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatChannelUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatChannelUser_UsersId",
                table: "ChatChannelUser",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatChannelUser");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "ChatChannels",
                newName: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_ChatChannels_CreatedById",
                table: "ChatChannels",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatChannels_Users_CreatedById",
                table: "ChatChannels",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
