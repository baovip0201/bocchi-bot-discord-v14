const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("Xin chào, tôi là bot âm nhạc")
})

app.listen(3000, () => {
  console.log("App is ready")
})


require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player, useQueue } = require("discord-player")


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
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

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))

for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`)
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
  console.log(`Logged in as ${client.user.tag}`)
})


client.on("interactionCreate", (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return

    const slashcmd = client.slashcommands.get(interaction.commandName)
    if (!slashcmd) interaction.reply("Command không hợp lệ")

    await interaction.deferReply()
    await slashcmd.run({ client, interaction })
  }
  handleCommand()
})


client.login(process.env.TOKEN)

