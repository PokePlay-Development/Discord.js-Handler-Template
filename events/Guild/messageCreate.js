const settings = require("../../settings.json")
module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.channel.partial) await message.channel.fetch();
	if(message.partial) await message.fetch();
    let prefix = settings.messageContentCommands.prefix
    let args = message.content.slice(prefix.length).trim().split(/ +/).filter(Boolean);
    let command = args.length > 0 ? args.shift().toLowerCase() : null;
    if(!command || command.length == 0) return;
    let cmd;
    cmd = client.commands.get(command);
    if(!cmd) cmd = client.commands.get(client.aliases.get(cmd));
    if(cmd) {
        try {
            cmd.run(client, message, args)
        } catch (e) {
            console.log(`[Error]`.red, `MESSAGE EVENT ERROR`.white, `\n${String(e.stack)}`)
        }
    }
}