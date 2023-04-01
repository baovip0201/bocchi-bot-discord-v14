module.exports = {
    handleCommand: async (client, interaction) => {
        const slashcmd = client.slashcommands.get(interaction.commandName)
        if (!slashcmd) interaction.reply("Command không hợp lệ")

        await interaction.deferReply()
        await slashcmd.run({ client, interaction })
    }

}