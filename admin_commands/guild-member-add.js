const {EmbedBuilder}=require("discord.js")
const axios=require('axios').default
module.exports={
    addMember: async (member)=>{
        const guildId=member.guild.id
        axios.get(`https://mini-api-bocchi-bot.vercel.app/welcome/${guildId}`).then(res=>{
            const welcomeChannel=member.guild.channels.cache.get(res.data.Channel)
            let embed= new EmbedBuilder()

            embed.setColor("DarkGreen")
            .setTitle("**Thành viên mới**")
            .setDescription(res.data.Content)
            .addFields({name: "Tống số thành viên", value: `${member.guild.memberCount}`})
            .setTimestamp(Date.now())

            welcomeChannel.send({embeds: [embed]})
            member.roles.add(data.Role)
        }).catch(error => {
            if (error.response) {
              console.log('Server Error:', error.response.data);
            } else if (error.request) {
              console.log('Network Error:', error.message);
            } else {
              console.log('Unknown Error:', error.message);
            }
          });
    }
}