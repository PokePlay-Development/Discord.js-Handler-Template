const { readdirSync } = require("fs")
console.log(`[COMMAND HANDLER]`.green, `Command Handler Was Successfully Enabled.`.white)
module.exports = async (client) => {
    try {
        readdirSync(`${process.cwd()}/commands/`).filter(file => file.endsWith(".js")).forEach(async commandFile => {
            let file = require("../commands/{name}".replace("{name}", commandFile))
            if(file.name) {
                client.commands.set(file.name, commandFile)
            } else {
                console.log(`[Error]`.red, `Command Handler Error`.white, `\nMissing A Command.Name or Command.Name is Not A String`.green)
            }
            if (file.aliases && Array.isArray(file.aliases)) file.aliases.forEach((alias) => client.aliases.set(alias, file.name));
        })
    } catch (e) {
        console.log(`[Error]`.red, `Command Handler Error`.white, `\n\n${String(e.stack)}`)
    }
}