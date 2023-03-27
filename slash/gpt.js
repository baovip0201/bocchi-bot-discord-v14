const {SlashCommandBuilder} =require("@discordjs/builders")

module.exports={
    data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Hỏi bot")
    .addStringOption((option)=>
        option
        .setName("text")
        .setDescription("Nhập câu hỏi")
        .setRequired(true)),
    run: async ({client, interaction})=>{
        
    }
}