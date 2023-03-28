const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder }=require("discord.js");
const { text } = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Hướng dẫn sử dụng Bot"),
  run: async ({ client, interaction }) => {
    let embed=new EmbedBuilder()
    embed.setColor("Blue")
        .setDescription(`**Xin chào, tôi là Bocchi, sau đây là hướng dẫn sử dụng tôi 💭💭💭**\n
        **Đối với ai muốn nghe nhạc🆗 🆗**\n
        /play search "keyword": tìm kiếm nhạc thông qua keyword\n
        /play song "url": tìm kiếm nhạc bằng cách nhập url bài hát\n
        /play playlist "url": nhập url danh sách bài hát để phát\n
        /queue: xem hàng đợi các bài hát\n
        /resume: tiếp tục phát nhạc\n
        /pause: dừng phát nhạc\n
        /info: thông tin bài đang phát\n
        /shuffle: xào bài\n
        /skip: bỏ qua bài hiện tại\n
        /skipto: skip đến bài thứ # trong hàng đợi\n
        /quit: dừng nhạc và tôi sẽ thoát voice channel\n
        **Đối với ai muốn trò chuyện với tôi 🆗 🆗**\n
        /ask message "message", nếu muốn reset cuộc trò chuyện thì chọn thêm option number, với giá trị là 1\n
        **Nếu bạn muốn chửi ai đó 🆗 🆗**\n
        /blame "name"\n\n`)
        .setFooter({text: "Xin cảm ơn vì đã đọc 💬 💬"})
        
    interaction.editReply({embeds: [embed]})
  }
}