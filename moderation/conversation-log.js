const mongoose = require("mongoose")
const conversationLogger = require("../models/ConversationLog")
const { model, Schema } = require("mongoose")

module.exports = {
    getConversationLog: async (client, message) => {
        let conversationLog =[];
        let prevMessages = await message.channel.messages.fetch({ limit: 1 });
        prevMessages.reverse()

        prevMessages.forEach(msg => {
            if (message.content.startsWith('!')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;

            conversationLog.push({
                userId: `${message.author.id}`,
                userTag: `${message.author.tag}`,
                content: msg.content
            })
        });

        await conversationLog.forEach(log => {
            const newLog = conversationLogger.create({
                guildId: message.guild.id,
                userId: log.userId,
                userTag: log.userTag,
                content: log.content
            })
        });
        //console.log(conversationLog)
        // this option prevents additional documents from being inserted if one fails
    }
}