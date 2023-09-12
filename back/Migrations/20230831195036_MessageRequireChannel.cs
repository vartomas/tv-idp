using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TV_IDP.Migrations
{
    /// <inheritdoc />
    public partial class MessageRequireChannel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages");

            migrationBuilder.AlterColumn<int>(
                name: "ChannelId",
                table: "ChatMessages",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages",
                column: "ChannelId",
                principalTable: "ChatChannels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages");

            migrationBuilder.AlterColumn<int>(
                name: "ChannelId",
                table: "ChatMessages",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages",
                column: "ChannelId",
                principalTable: "ChatChannels",
                principalColumn: "Id");
        }
    }
}
