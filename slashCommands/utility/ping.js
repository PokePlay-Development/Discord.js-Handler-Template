module.exports = {
    name: `ping`,
    description: `Get the bot's ping!`,
    options: [
        //{ name: `test`, description: `A Test Command From Discord.jsV14!`, type: `String`,required: true },
        //{ name: `test2`, description: `A Test Command From Discord.jsV14!`, type: `User`,required: true },
        //{ name: `test3`, description: `A Test Command From Discord.jsV14!`, type: `Role`,required: true },
        //{ name: `test4`, description: `A Test Command From Discord.jsV14!`, type: `Channel`,required: true },
        //{ name: `test5`, description: `A Test Command From Discord.jsV14!`, type: `Integer`,required: true },
        //{ name: `test6`, description: `A Test Command From Discord.jsV14!`, type: `StringChoices`,required: true , choices: [{ name: `test`, value: `test`}]},
    ],
    run: async (client, interaction) => {
        const { options } = interaction;
        return interaction.reply({ content: `Pong! My Ping is **${client.ws.ping}ms**`})
    }
}