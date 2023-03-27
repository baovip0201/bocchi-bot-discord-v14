const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Bỏ qua bài hát hiện tại"),
	run: async ({ client, interaction }) => {
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

        const currentSong = queue.currentTrack

		queue.node.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkBlue")
                .setDescription(`${currentSong.title} đã bị skip!`)
                .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
