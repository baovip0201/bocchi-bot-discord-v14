const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    handleButton: async (client, interaction) => {
        let buttonPause = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("btn-play")
                    .setLabel("▶️")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-next")
                    .setLabel("⏩")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-shuffle")
                    .setLabel("🔀")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-quit")
                    .setLabel("Quit")
                    .setStyle(ButtonStyle.Danger))

        let buttonResume = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("btn-play")
                    .setLabel("⏸")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-next")
                    .setLabel("⏩")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-shuffle")
                    .setLabel("🔀")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("btn-quit")
                    .setLabel("Quit")
                    .setStyle(ButtonStyle.Danger))
        let embed = new EmbedBuilder()


        var queue = await client.player.nodes.get(interaction.guildId)

        if (interaction.customId === "btn-play") {
            if (!queue) return interaction.reply("Không có bài hát nào trong hàng đợi")
            if (queue.node.isPaused()) {
                queue.node.resume()
                await interaction.update({ components: [buttonResume] })
            } else {
                queue.node.pause()
                await interaction.update({ components: [buttonPause] })
            }
        }
        if (interaction.customId === "btn-next") {
            if (!queue) {
                interaction.reply("Không có bài hát nào trong hàng đợi")
            } else {
                queue.node.skip()
                queue=client.player.nodes.get(interaction.guildId)
                const song = queue.currentTrack
                interaction.update({
                    embeds: [embed
                        .setColor("Blurple")
                        .setDescription(`**[${song.title}](${song.url})**`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({ text: `Duration: ${song.duration}` })],
                    components: [buttonResume]
                })
            }
        }
        if (interaction.customId === "btn-shuffle") {
            if (!queue) {
                interaction.reply("Không có bài hát nào trong hàng đợi")
            } else {
                
                queue.tracks.shuffle()
                await interaction.update({ components: [buttonResume] })
            }
        }
        if (interaction.customId === "btn-quit") {
            if(!queue) return await interaction.update({ components: [] })
            queue.delete()
            await interaction.update({ components: [] })
        }

    }
}
