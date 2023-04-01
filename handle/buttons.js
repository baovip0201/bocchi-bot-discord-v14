const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
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

        const queue = client.player.nodes.get(interaction.guildId)
        if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")
        if (interaction.customId === "btn-play") {
            if (queue.node.isPaused()) {
                queue.node.resume()
                interaction.update({ components: [buttonResume] })
            } else {
                queue.node.pause()
                interaction.update({ components: [buttonPause] })
            }
        }
        if (interaction.customId === "btn-next") {
            queue.node.skip()
            interaction.update({components:[buttonResume]})
        }
        if (interaction.customId === "btn-shuffle") {
            queue.tracks.shuffle()
            interaction.update({ components: [buttonResume] })
        }
        if (interaction.customId === "btn-quit") {
            queue.delete()
            interaction.update({ components: [buttonResume] })
        }
    }
}