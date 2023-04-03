const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require("discord.js")
const ticketSchema = require("../models/ticketSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-disable")
        .setDescription("Disable hệ thống ticket"),
    run: async ({ client, interaction }) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: "Bạn phải có quyền Admin mới setup được ticket", ephemeral: true })

        ticketSchema.deleteMany({Guild: interaction.guild.id})
        .then(async (err, data)=>{
            await interaction.editReply({content: "Đã loại bỏ hệ thống ticket của bạn", ephemeral:true})
        })
}
}