const { SlashCommandBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");
var conversationLog = [
  { role: "system", content: "Xin chào, bạn là một AI thông minh và tốt đẹp, dường như bạn biết rất nhiều thứ" },
].slice(0, 15);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat-bot")
    .setDescription("Hỏi bot")
    .addSubcommand((subcommand) => 
      subcommand
        .setName("image")
        .setDescription("Kêu bot gửi ảnh")
        .addStringOption((option) => 
          option.setName("message")
            .setDescription("Nhập tin nhắn")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => 
      subcommand
        .setName("chat")
        .setDescription("Trò chuyện dạng văn bản")
        .addStringOption((option) => 
          option.setName("message")
            .setDescription("Nhập tin nhắn")
            .setRequired(true)
        )

    )
    .addSubcommand((subcommand) => 
      subcommand
        .setName("edit-image")
        .setDescription("Chỉnh sửa ảnh")
        .addStringOption((option) => 
          option.setName("message")
            .setDescription("Nhập tin nhắn")
            .setRequired(true)
        )

    ),
  run: async ({ client, interaction }) => {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(config);

    try {
      // if (interaction.options.getNumber("number") === 1)
      //   conversationLog = [
      //     { role: "system", content: "Xin chào, bạn là một Bot AI tốt" },
      //   ].slice(0, 15);

      if (interaction.options.getSubcommand() === "image") {
        let text = interaction.options.getString("message");
        //conversationLog.push({ role: "user", content: text });
        const res = await openai.createImage({
          prompt: text,
          n: 1,
          size: "1024x1024"
        })
        const imageUrl = res.data.data[0].url
        interaction.editReply(imageUrl)

      }
      else if (interaction.options.getSubcommand() === "chat") {
        let text = interaction.options.getString("message");
        conversationLog.push({ role: "user", content: text });
        const res = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: conversationLog,
        });
        interaction.editReply(res.data.choices[0].message);
      }
      else if (interaction.options.getSubcommand() === "chat") {
        let text = interaction.options.getString("message");
        const res=await openai.createImageEdit(
        )
        const imageUrl=res.data.data[0].url
        interaction.editReply(imageUrl)
      }
    } catch (error) {
      console.log(error);
    }
  },
};
