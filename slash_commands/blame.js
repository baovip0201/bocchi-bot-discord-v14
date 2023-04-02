const {SlashCommandBuilder} =require("@discordjs/builders")

module.exports={
    data: new SlashCommandBuilder()
    .setName("blame")
    .setDescription("Chửi ai đó")
    .addStringOption((option)=>
        option
        .setName("message")
        .setDescription(`Nhập thông điệp "yêu thương" bạn muốn gửi gắm cho bạn của mình`)
        .setRequired(true)),
    run: async ({client, interaction})=>{
        const message=interaction.options.getString("message")
        interaction.editReply(message)
    }
}