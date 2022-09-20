const { Client, Collection, GatewayIntentBits, Collector } = require("discord.js");
const settings = require("./settings.json")
const colors = require("colors")
const client = new Client({
    shards: 'auto',
    
    allowedMentions: {
        parse: [ ],
        repliedUser: false
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        GatewayIntentBits.Guilds,
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
        GatewayIntentBits.MessageContent
    ]
})
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