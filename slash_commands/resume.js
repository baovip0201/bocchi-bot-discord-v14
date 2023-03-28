const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Tiếp tục chơi"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

		queue.node.resume()
		await interaction.editReply("Nhac bị dừng! Use `/resume` để tiếp tục bài hát")
	},
}
