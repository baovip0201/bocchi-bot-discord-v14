const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles hàng đợi"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

		queue.tracks.shuffle()
		await interaction.editReply(`Hàng đợi của ${queue.tracks.length} đã được shuffles `)
	},
}
