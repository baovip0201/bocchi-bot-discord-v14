const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Emoji } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Tải bài hát từ Youtube")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Tải 1 bài hát từ url")
                .addStringOption((option) => option.setName("url").setDescription("url của bài hát").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Tải playlist của các bài hát tự url")
                .addStringOption((option) => option.setName("url").setDescription("url của playlist").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Tìm kiếm bài hát bằng keyword")
                .addStringOption((option) =>
                    option.setName("searchterms").setDescription("keyword").setRequired(true)
                )
        ),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("Bạn cần join vào voice channel")

        const queue = await client.player.nodes.create(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()
        let button = new ActionRowBuilder()
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
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("btn-info")
                    .setLabel("Info")
                    .setStyle(ButtonStyle.Primary)
                    )

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Không có kết quả")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** đã được thêm vào hàng đợi`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })

        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            const playlist = result.playlist
            await queue.addTrack(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} từ [${playlist.title}](${playlist.url})** đã được thêm vào hàng đợi`)
                .setThumbnail(playlist.thumbnail)
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            const song = result.tracks[0]
            await queue.addTrack(song)
            //console.log(queue.addTrack(song))
            embed
                .setColor("Blurple")
                .setDescription(`**[${song.title}](${song.url})** đã được thêm vào hàng đợi`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }
        if (!queue.node.isPlaying()) await queue.node.play()

        await interaction.editReply({
            embeds: [embed], components: [button]
        })
    },
}
