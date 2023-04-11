const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const axios = require("axios").default

module.exports = {
    ticketForm: async (interaction) => {
        const modal = new ModalBuilder()
            .setTitle("Cung cấp thông tin cho chúng tôi")
            .setCustomId("modal")

        const email = new TextInputBuilder()
            .setCustomId("email")
            .setRequired(true)
            .setLabel("Cung cấp email của bạn")
            .setPlaceholder("Bạn phải điền email hợp lệ")
            .setStyle(TextInputStyle.Short)

        const username = new TextInputBuilder()
            .setCustomId("username")
            .setRequired(true)
            .setLabel("Cung cấp username của bạn")
            .setPlaceholder("Đây là username của bạn")
            .setStyle(TextInputStyle.Short)

        const reason = new TextInputBuilder()
            .setCustomId("reason")
            .setRequired(true)
            .setLabel("Lý do bạn viết ticket")
            .setPlaceholder("Cho chúng tôi lý do viết ticket này")
            .setStyle(TextInputStyle.Short)

        const firstActionRow = new ActionRowBuilder().addComponents(email)
        const secondActionRow = new ActionRowBuilder().addComponents(username)
        const thirdActionRow = new ActionRowBuilder().addComponents(reason)

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)
        let choices;
        if (interaction.isStringSelectMenu()) {
            choices = interaction.values
            const result = choices.join('')
            const guildId= interaction.guild.id
            const update = { ticket: result }
            axios.post(`https://mini-api-bocchi-bot.vercel.app/ticketsystem/${guildId}`, update ).then(res=>{
              if(res.status===200){
                console.log(res.data)
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

        if (!interaction.isModalSubmit()) {
            interaction.showModal(modal)
        }



    }
}