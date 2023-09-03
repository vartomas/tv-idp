﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TV_IDP.Migrations
{
    /// <inheritdoc />
    public partial class ModelsAnotherFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatChannelUser");

            migrationBuilder.AddColumn<int>(
                name: "ChatChannelId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ChatChannelId",
                table: "Users",
                column: "ChatChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ChatChannels_ChatChannelId",
                table: "Users",
                column: "ChatChannelId",
                principalTable: "ChatChannels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_ChatChannels_ChatChannelId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ChatChannelId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ChatChannelId",
                table: "Users");

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
    }
}
