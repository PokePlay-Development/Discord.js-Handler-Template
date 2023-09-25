const { readdirSync, read } = require("fs")
console.log(`[EVENT HANDLER]`.green, `Loading Events`.white)
let eventCount = 0;
module.exports = async (client) => {
   try {
      // The Client And Guild Folder is Just To Help Organise Event Files.
     // Load All The RestEvents.
     readdirSync(`${process.cwd()}/events/RestEvents/`).forEach(async file => {
	if (!file.includes(".js")) return;
        let fileName = file.replace(".js", "")
        client.rest.on(fileName, require(`../events/RestEvents/${file}`).bind(null, client));
        eventCount = eventCount + 1
    })
    // load all events in the Folder Named Guild
    readdirSync(`${process.cwd()}/events/Guild/`).forEach(async file => {
	if (!file.includes(".js")) return;
        let fileName = file.replace(".js", "")
        client.on(fileName, require(`../events/Guild/${file}`).bind(null, client));
        eventCount = eventCount + 1
    })
    // Load All The Events in The Folder Named Client
    readdirSync(`${process.cwd()}/events/Client/`).forEach(async file => {
	if (!file.includes(".js")) return;
        let fileName = file.replace(".js", "")
        client.on(fileName, require(`../events/Client/${file}`).bind(null, client));
        eventCount = eventCount + 1;
    })
    console.log(`[EVENT HANDLER]`.green, `Loaded `.white + `${eventCount} `.green + `Events`.white)
   } catch (e) {
    console.log(`[EVENT HANDLER]`.red, `Event Handler Error`.white, `\n\n${String(e.stack)}`)
   }
}