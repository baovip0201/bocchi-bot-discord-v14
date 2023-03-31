const {SlashCommandBuilder, PermissionFlagsBits}=require("discord.js")
const welcomeSchema=require("../models/Welcome")

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

        welcomeSchema.findOne({Guild: interaction.guild.id})
        .then(async (data)=>{
            if(!data){
                const newWelcome= await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Content: welcomeMessage,
                    Role: welcomeRole.id
                })
            }
            interaction.editReply("Tạo tin nhắn chào mừng thành công!!")
        })
    }
}