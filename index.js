const express = require("express")
const app = express()
require("dotenv").config();
const { Client, GatewayIntentBits, Collection, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")
const { Configuration, OpenAIApi } = require('openai');
//const { run } = require("./database/log_controller");
const { connectMongoDb } = require("./database/connect-mongodb");
const { addMember } = require("./admin_commands/guild-member-add");
const { getConversationLog } = require("./moderation/conversation-log");
const { handleButton } = require("./handle/buttons");
const { handleCommand } = require("./handle/commands");
const ticketSchema = require("./models/ticketSchema");
const { submitModal } = require("./handle/modal-submit");
const { ticketForm } = require("./handle/ticket-form");


app.get("/", (req, res) => {
  res.send("Xin chào, tôi là bot âm nhạc")
})

app.listen(3000, () => {
  console.log("App is ready")
})



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
})


client.slashcommands = new Collection()
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
})

let commands = []

const slashFiles = fs.readdirSync("./slash_commands").filter(file => file.endsWith(".js"))

for (const file of slashFiles) {
  const slashcmd = require(`./slash_commands/${file}`)
  client.slashcommands.set(slashcmd.data.name, slashcmd)
  commands.push(slashcmd.data.toJSON())
}



client.on("ready", () => {
  const guild_ids = client.guilds.cache.map(guild => guild.id);
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)
  console.log("Deploying slash commands")
  for (const guildId of guild_ids) {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
      .then(() => {
        console.log("Successfully loaded")
        //process.exit(0)
      })
      .catch((err) => {
        if (err) {
          console.log(err)
          process.exit(1)
        }
      })
  }
  connectMongoDb()
  console.log(`Logged in as ${client.user.tag}`)
})


client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) handleButton(client, interaction)
  if (interaction.isCommand()) handleCommand(client, interaction)
  //if(interaction.isModalSubmit()) submitModal(client, interaction)

})

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) return
  if (interaction.isChatInputCommand()) return
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
    ticketSchema.findOne({ Guild: interaction.guild.id })
      .then(async (data) => {
        const filter = { Guild: interaction.guild.id }
        const update = { Ticket: result }
        ticketSchema.updateOne(filter, update, {
          new: true
        })
          .then(value => console.log(value))
      })
  }

  if (!interaction.isModalSubmit()) {
    interaction.showModal(modal)
  }
})

client.on("interactionCreate", (interaction) => {
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal") {
      ticketSchema.findOne({ Guild: interaction.guild.id })
        .then(async (data) => {
          const emailInput = interaction.fields.getTextInputValue("email")
          const usernameInput = interaction.fields.getTextInputValue("username")
          const reasonInput = interaction.fields.getTextInputValue("reason")

          const postChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`)
          if (postChannel) return await interaction.reply({ content: `Bạn đã có 1 ticket mở- ${postChannel}`, ephemeral: true })
          const category = data.Channel

          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`Ticket của ${interaction.user.username}`)
            .setDescription("Chào bạn đến với ticket của bạn, vui lòng đợi nhân viên xem xet thông tin của bạn")
            .addFields(
              { name: `Email`, value: `${emailInput}` },
              { name: `Username`, value: `${usernameInput}` },
              { name: `Reason`, value: `${reasonInput}` },
              { name: `Type`, value: `${data.Ticket}` })
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
        })


    }
  }
})

client.on("messageCreate", async (message) => {
  await getConversationLog(client, message)
});

client.on("guildMemberAdd", async (member) => {
  await addMember(member)
  console.log(member)
})


client.login(process.env.TOKEN)

