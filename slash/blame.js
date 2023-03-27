const {SlashCommandBuilder} =require("@discordjs/builders")

module.exports={
    data: new SlashCommandBuilder()
    .setName("blame")
    .setDescription("Chửi ai đó")
    .addStringOption((option)=>
        option
        .setName("name")
        .setDescription("Nhập tên người bạn muốn chửi")
        .setRequired(true)),
    run: async ({client, interaction})=>{
        const name=interaction.options.getString("name")
        const listBlame=[`**Địt mẹ mày ${name} 🖕🖕🖕🖕🖕🖕**`,`**Sao mày ngu vậy ${name} ???**`,
        `**Ok ok bạn là nhất, nhất bạn luôn
        \nBạn luôn đúng, tôi mới là người sai
        \nBạn thắng mình thua được chưa ?
        \nBạn xứng đáng là kẻ nắm giữ đáp án chính xác của nhân loại
        \nBạn mà đã nói là không thể sai được.
        \nBạn nói chí phải, không ai làm lại bạn được luôn.
        \nBạn nói đúng thế, mình cũng phải gật gù thay bạn đó.
        \nBạn nói không trật vào đâu được, siêu thật đấy.
        \nCứ cho là bạn đúng đi, bạn đúng, bạn đúng nhất.
        \nỒ bạn nói đúng thật đó, sao giờ mình mới nhận ra nhỉ?
        \nCó ai từng nói với bạn rằng ý kiến của bạn rất hay không?
        \nCông nhận đấy, mình cũng nghĩ giống bạn.
        \nMình biết bạn sẽ không làm mình thất vọng mà!
        \nBạn khiến mình phải nể phục đó!
        \nỒ ra là vậy, cảm ơn bạn nhiều nha!
        \nVâng bạn nói mình xin nghe ạ.
        \nLời của bạn làm mình rơi nước mắt luôn đó
        **`,
        `**Biết chơi game không ?**`,
        `**Ad bắn đi, ${name}**`,
        `**Biết giữ vị trí không ?**`

    ]
        interaction.editReply(listBlame[Math.floor(Math.random()*6)])
    }
}