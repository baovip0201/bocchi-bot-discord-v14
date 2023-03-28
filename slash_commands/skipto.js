const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("skipto").setDescription("Skip đến track #")
        .addNumberOption((option) =>
            option.setName("tracknumber").setDescription("The track to skip to").setMinValue(1).setRequired(true)),
    run: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue) return await interaction.editReply("Không có bài hát nào trong hàng đợi")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Số track không hợp lệ")
        queue.node.skipTo(trackNum - 1)

        await interaction.editReply(`Đã skip đến số track ${trackNum}`)
    },
}
