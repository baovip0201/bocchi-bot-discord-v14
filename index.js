const express = require("express")
const app = express()
require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player} = require("discord-player")
const { Configuration, OpenAIApi } = require('openai');
//const { run } = require("./database/log_controller");
const { connectMongoDb } = require("./database/connect-mongodb");
const { addMember } = require("./admin_commands/guild-member-add");
const { getConversationLog } = require("./moderation/conversation-log");
const { handleButton } = require("./handle/buttons");
const { handleCommand } = require("./handle/commands");


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
  if(interaction.isButton()) handleButton(client, interaction)
  if(interaction.isCommand()) handleCommand(client, interaction)
})

client.on("messageCreate", async (message) => {
  await getConversationLog(client, message)
});

client.on("guildMemberAdd", (member)=>{
   addMember(member)
})


client.login(process.env.TOKEN)

