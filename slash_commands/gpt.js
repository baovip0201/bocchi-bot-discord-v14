const { SlashCommandBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");
var conversationLog = [
  { role: "system", content: "Xin chào, bạn là một Bot AI tốt" },
].slice(0, 15);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Hỏi bot")
    .addStringOption((option) =>
      option.setName("message")
            .setDescription("Nhập câu hỏi")
            .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("Nhập 1 để tạo reset cuộc trò chuyện")
        .setMinValue(1)
    ),
  run: async ({ client, interaction }) => {
    const text = interaction.options.getString("message");
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(config);

    try {
      if (interaction.options.getNumber("number") === 1)
        conversationLog = [
          { role: "system", content: "Xin chào, bạn là một Bot AI tốt" },
        ].slice(0, 15);

      conversationLog.push({ role: "user", content: text });
      console.log(conversationLog);

      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationLog,
      });
      
      interaction.editReply(res.data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  },
};
