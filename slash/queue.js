const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Hiển thị các bài hát hiện trong hàng đợi")
    .addNumberOption((option) => option.setName("page").setDescription("Số trang của hàng đợi").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)
        if (!queue || !queue.node.isPlaying()){
            return await interaction.editReply("Không có bài hát nào trong hàng đợi")
        }

        const totalPages = Math.ceil(queue.tracks.size / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply(`Trang không hợp lệ. Chỉ có tổng ${totalPages} trang`)
        
        
        const queueString = queue.tracks.toArray().map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        console.log(queueString)

        const currentSong = queue.currentTrack

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("DarkGreen")
                    .setDescription(`**Bài hiện tại đang chơi**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Trang ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}