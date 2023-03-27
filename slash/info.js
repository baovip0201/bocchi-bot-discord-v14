const { SlashCommandBuilder } = require("@discordjs/builders")
const {	EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Hiển thị thông tin về bài hát hiện tại"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

		let bar = queue.node.createProgressBar({
			queue: false,
			length: 20,
		})

        const song = queue.currentTrack

		await interaction.editReply({
			embeds: [new EmbedBuilder()
			.setColor("Blurple")
            .setThumbnail(song.thumbnail)
            .setDescription(`Đang chơi [${song.title}](${song.url})\n\n` + bar)
        ],
		})
	},
}
