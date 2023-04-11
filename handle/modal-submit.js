const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType} = require("discord.js")
const axios= require("axios").default

module.exports = {
    submitModal: async (interaction) => {
        if (interaction.customId === "modal") {
          const guildId= interaction.guild.id
            axios.get(`https://mini-api-bocchi-bot.vercel.app/ticketsystem/${guildId}`).then(async res=>{
              if(res.status=200){
                const emailInput = interaction.fields.getTextInputValue("email")
                const usernameInput = interaction.fields.getTextInputValue("username")
                const reasonInput = interaction.fields.getTextInputValue("reason")
      
                const postChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`)
                if (postChannel) return await interaction.reply({ content: `Bạn đã có 1 ticket mở- ${postChannel}`, ephemeral: true })
                const category = res.data.Channel
      
                const embed = new EmbedBuilder()
                  .setColor("Blue")
                  .setTitle(`Ticket của ${interaction.user.username}`)
                  .setDescription("Chào bạn đến với ticket của bạn, vui lòng đợi nhân viên xem xet thông tin của bạn")
                  .addFields(
                    { name: `Email`, value: `${emailInput}` },
                    { name: `Username`, value: `${usernameInput}` },
                    { name: `Reason`, value: `${reasonInput}` },
                    { name: `Type`, value: `${res.data.Ticket}` })
                  .setFooter({ text: `${interaction.guild.name} tickets` })
      
                const button = new ActionRowBuilder()
                  .addComponents(new ButtonBuilder()
                    .setCustomId("ticket")
                    .setLabel("Close ticket")
                    .setStyle(ButtonStyle.Danger))
      
                let channel = await interaction.guild.channels.create({
                  name: `ticket-${interaction.user.id}`,
                  type: ChannelType.GuildText,
                  parent: `${category}`
                })
      
                let msg = await channel.send({ embeds: [embed], components: [button] })
                interaction.reply({ content: `Ticket của bạn hiện đang mở trên ${channel}`, ephemeral: true })
      
                const collector = msg.createMessageComponentCollector()
      
                collector.on("collect", async i => {
                  ; (await channel).delete()
                  const deEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Ticker của bạn đã đóng`)
                    .setDescription("Cảm ơn đã liên hệ với chúng tôi, nếu bạn có vấn đề nào khác, đừng ngần ngại viết ticket khác")
                    .setFooter({ text: `${interaction.guild.name} tickets` })
                    .setTimestamp()
      
                  await interaction.member.send({ embeds: [deEmbed] }).catch(err => {
                    return
                  })
                })
              }
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
}