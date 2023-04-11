const { PermissionsBitField,SlashCommandBuilder } = require("discord.js")
const axios = require("axios").default
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-disable")
        .setDescription("Disable hệ thống ticket"),
    run: async ({ client, interaction }) => {
        const guildId= interaction.guild.id
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: "Bạn phải có quyền Admin mới setup được ticket", ephemeral: true })

        axios.delete(`https://mini-api-bocchi-bot.vercel.app/ticketsystem/${guildId}`).then(async res=>{
            console.log(res.data)
            await interaction.editReply({content: "Đã loại bỏ hệ thống ticket của bạn", ephemeral:true})
        })
}
}