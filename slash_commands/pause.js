const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Dừng nhạc"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

		queue.node.pause()
		await interaction.editReply("Nhạc đã dừng! Dùng `/resume` để tiếp tục")
	},
}
