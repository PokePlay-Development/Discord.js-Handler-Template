module.exports = {
    name: `test`,
    description: `A Test Command From Discord.jsV14!`,
    run: async (client, interaction) => {
        return interaction.reply({ content: `Discord.jsv14 is here!`})
    }
}