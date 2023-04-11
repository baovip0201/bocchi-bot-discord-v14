const {SlashCommandBuilder, PermissionFlagsBits}=require("discord.js")
const axios = require("axios").default

module.exports={
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Setup chào mừng thành viên mới")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName("channel").setDescription("Chọn kênh để chào mừng").setRequired(true))
    .addStringOption(option => option.setName("welcome-message").setDescription("Nhập tin nhắn chào mửng").setRequired(true))
    .addRoleOption(option => option.setName("welcome-role").setDescription("Nhập vai trò").setRequired(true)),
    run: async ({client, interaction}) =>{
        const channel= interaction.options.getChannel("channel")
        const welcomeMessage= interaction.options.getString("welcome-message")
        const welcomeRole= interaction.options.getRole("welcome-role")
        const reqBody={
            guildId: interaction.guild.id,
            channelId: channel.id,
            content: welcomeMessage,
            role: welcomeRole.id
        }
        axios.post('https://mini-api-bocchi-bot.vercel.app/welcome', reqBody).then((res)=>{
            console.log(res.data)
            interaction.editReply("Tạo tin nhắn chào mừng thành công!!")
        }).catch(error=>{
            if (error.response) {
                console.log('Server Error:', error.response.data);
              } else if (error.request) {
                console.log('Network Error:', error.message);
              } else {
                console.log('Unknown Error:', error.message);
              }
        })
    }
}