const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js")
const axios = require('axios').default

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-set")
        .setDescription("Setup hệ thống ticket")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel bạn muốn gửi ticket")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .addChannelOption(option => option
            .setName("category")
            .setDescription("Category bạn muốn ticket gửi vào")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)),
    run: async ({ client, interaction }) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: "Bạn phải có quyền Admin mới setup được ticket", ephemeral: true })

        const channel = interaction.options.getChannel("channel")
        const category = interaction.options.getChannel("category")
        const reqBody = {
            guildId: interaction.guild.id,
            channelId: category.id,
            ticket: 'first'
        }
        axios.post('https://mini-api-bocchi-bot.vercel.app/ticketsystem', reqBody).then(async (res) => {
            console.log(res.status)

            const embed = new EmbedBuilder()
                .setColor("DarkNavy")
                .setTitle("Hệ thống ticket")
                .setDescription("Nếu có vấn đề gì, hãy submit ticket cho chúng tôi")
                .setFooter({ text: `Những ticket của ${interaction.guild.name}` })

            const menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("select")
                        .setMaxValues(1)
                        .setPlaceholder("Chọn 1 chủ để...")
                        .addOptions(
                            {
                                label: `General Support`,
                                value: `Chủ đề: General Support`
                            },
                            {
                                label: `Moderation Support`,
                                value: `Chủ đề: Moderation Support`
                            },
                            {
                                label: `Server Support`,
                                value: `Chủ đề: Server Support`
                            },
                            {
                                label: `Others`,
                                value: `Chủ đề: Others`
                            },
                        )
                )
            await channel.send({ embeds: [embed], components: [menu] })
            if (interaction.isStringSelectMenu()) console.log("hi")
            await interaction.editReply({ content: `Hệ thống ticket của bạn đã được set up trong ${channel}`, ephemeral: true })

        }).catch(async error => {
            if (error.response && error.response.status === 401) {
                return await interaction.editReply({ content: "Bạn đã setup ticket rồi, chạy lệnh /ticket-disable để xóa và khởi động lại" })
            }
            else if (error.request) {
                console.log('Network Error:', error.message);
            } else {
                console.log('Unknown Error:', error.message);
            }
        })

    }
}