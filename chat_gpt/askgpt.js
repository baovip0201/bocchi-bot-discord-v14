module.exports = {
    run: async (client, message, openai) => {

        if (message.author.bot) return;
        //if (message.channel.id !== process.env.DISCORD_BOT_TOKEN) return;
        if (message.content.startsWith('!')) return;

        if (message.content === "kita:rule?") {
            await message.channel.sendTyping();
            message.reply("-------------------------------------------------------\n\n? + đoạn text\nVí dụ: ? Biết ông Liêm không ?\n\n-------------------------------------------------------")
        }

        if (message.content.startsWith('?')) {

            let conversationLog = [{ role: 'system', content: 'Bạn là một con bot tốt.' }];
            try {
                await message.channel.sendTyping();

                //Để duy trì được cuộc trò chuyện, ta phải lưu thông tin trước đó. 
                //Phản hồi này được xây dựng dựa trên lịch sử trò chuyện đã lưu trữ trước đó. 
                //Cuối cùng, xuất các thông điệp phản hồi từ AI và thêm chúng vào lịch sử trò chuyện (conversationLog) để duy trì cuộc trò chuyện. 

                //1.Lấy đoạn tin nhắn cũ trước tin nhắn hiện tại và đảo ngược thứ tự tin nhắn
                let prevMessages = await message.channel.messages.fetch({ limit: 15 });
                prevMessages.reverse();

                prevMessages.forEach((msg) => {
                    if (message.content.startsWith('!')) return;
                    if (msg.author.id !== client.user.id && message.author.bot) return;
                    if (msg.author.id !== message.author.id) return;

                    //2. push tin nhắn vào mảng 2 thuộc tính là role(người dùng) và content(nội dung tin nhắn)
                    conversationLog.push({
                        role: 'user',
                        content: msg.content.substring(1),
                    });
                });

                //3. gọi API của openai để trả về phản hồi cho người dùng
                const result = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: conversationLog,
                }).catch((error) => {
                    console.log(`Error: ${error}`)
                });

                message.reply(result.data.choices[0].message);

                const data = result.data.choices[0].message;
                console.log(data.role + '  ' + data.content);
                //console.log(result.data.choices[0].message);

            } catch (error) {
                console.log(`ERR: ${error}`);
            }
        }

    }
}