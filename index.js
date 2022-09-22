const { Client, Collection, GatewayIntentBits, Collector } = require("discord.js");
const settings = require("./settings.json")
const colors = require("colors")
let client;
if(settings.messageContentCommands.status == true) {
    client = new Client({
        shards: 'auto',
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
            //GatewayIntentBits.GuildMembers,
            //GatewayIntentBits.GuildBans,
            //GatewayIntentBits.DirectMessageReactions,
            //GatewayIntentBits.DirectMessageTyping,
            //GatewayIntentBits.DirectMessages,
            //GatewayIntentBits.GuildEmojisAndStickers,
            //GatewayIntentBits.GuildIntegrations,
            //GatewayIntentBits.GuildInvites,
            //GatewayIntentBits.GuildMembers,
            //GatewayIntentBits.GuildMessageReactions,
            //GatewayIntentBits.GuildMessageTyping,
            //GatewayIntentBits.GuildMessages,
            //GatewayIntentBits.GuildPresences,
            //GatewayIntentBits.GuildScheduledEvents,
            //GatewayIntentBits.GuildVoiceStates,
            //GatewayIntentBits.GuildWebhooks,
        ]
    })
} else {
    client = new Client({
        shards: 'auto',
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            //GatewayIntentBits.GuildMembers,
            //GatewayIntentBits.GuildBans,
            //GatewayIntentBits.DirectMessageReactions,
            //GatewayIntentBits.DirectMessageTyping,
            //GatewayIntentBits.DirectMessages,
            //GatewayIntentBits.GuildEmojisAndStickers,
            //GatewayIntentBits.GuildIntegrations,
            //GatewayIntentBits.GuildInvites,
            //GatewayIntentBits.GuildMembers,
            //GatewayIntentBits.GuildMessageReactions,
            //GatewayIntentBits.GuildMessageTyping,
            //GatewayIntentBits.GuildMessages,
            //GatewayIntentBits.GuildPresences,
            //GatewayIntentBits.GuildScheduledEvents,
            //GatewayIntentBits.GuildVoiceStates,
            //GatewayIntentBits.GuildWebhooks,
        ]
    })
}
client.slashCommands = new Collection();
if(settings.messageContentCommands.status == true) {
    client.commands = new Collection();
    client.aliases = new Collection();
    ['antiCrash', 'commands', 'events', 'slashCommands']
    .filter(Boolean)
    .forEach(item => {
        require(`./handlers/${item}`)(client);
    })
} else {
    ['antiCrash', 'events', 'slashCommands']
    .filter(Boolean)
    .forEach(item => {
        require(`./handlers/${item}`)(client);
    })
}

client.login(settings.token).catch(e => {
    console.log(`[Error]`.red, "Invalid or No Bot Token Provided.".green)
})
