const axios = require("axios").default

module.exports = {
    getConversationLog: async (client, message) => {
        const guildId = message.guildId
        const guildName = message.guild.name
        const categoryId = message.channel.parentId
        const categoryName = message.channel.parent.name
        const channelId = message.channelId
        const channelName = message.channel.name
        const userId = message.author.id
        const userTag = message.author.tag
        let preMessage = (await message.channel.messages.fetch({ limit: 1 })).first().content;
        const conversationLog = {
            guildId: guildId, 
            guildName: guildName, 
            categoryId: categoryId, 
            categoryName: categoryName, 
            channelId: channelId, 
            channelName: channelName, 
            userId: userId, 
            userTag: userTag, 
            messages: preMessage
        }

        axios.post('https://mini-api-bocchi-bot.vercel.app/conversationlog', conversationLog).then((res)=>{
            //console.log(res.data)
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