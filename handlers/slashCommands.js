const { SlashCommandBuilder, REST, Routes } = require("discord.js")
const config = require("../settings.json")
const dirSetup = config.slashCommandDirs;
const { readdirSync, lstatSync } = require("node:fs");
module.exports = async (client) => {
	try {
		let allCommands = new Array();
		readdirSync(`${process.cwd()}/slashCommands/`).forEach((dir) => {
			if(lstatSync(`${process.cwd()}/slashCommands/${dir}`).isDirectory()) {
				let cmdSetup = dirSetup.find(d=>d.folderName == dir);
				if(cmdSetup) {
					readdirSync(`${process.cwd()}/slashCommands/${dir}/`).forEach(async file => {
						if(file.endsWith(".js") && !lstatSync(`${process.cwd()}/slashCommands/${dir}/${file}`).isDirectory()) {
							let pull = require(`${process.cwd()}/slashCommands/${dir}/${file}`)
							if(pull.name && pull.description) {
								let Command = new SlashCommandBuilder().setName(`${cmdSetup.CmdName}`).setDescription(`${cmdSetup.CmdDescription}`);
								Command.addSubcommand((sub) => {
									sub.setName(`${pull.name}`).setDescription(`${pull.description}`)
									if(pull.options && pull.options.length > 0) {
										for(option of pull.options) {
											if(option.type && option.name && option.description) {
												let type = option.type;
												let name = option.name;
												let description = option.description;
												let required = false;
												if(option.required && option.required == true) {
													required = true;
												}
												if(type == "String") {
													sub.addStringOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "User") {
													sub.addUserOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "Role") {
													sub.addRoleOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "Channel") {
													sub.addChannelOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "Integer") {
													sub.addIntegerOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "Attachment") {
													sub.addAttachmentOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
												}
												if(type == "StringChoices") {
													let narray = [];
													option.choices.forEach(choice => {
														narray.push({ name: `${choice.name}`, value: `${choice.value}`})
													})
													sub.addStringOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required).addChoices(...narray))
												}
											}
										}
									}
									return sub;
								})
								allCommands.push(Command.toJSON())
								client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
							}
						}
					})
				} else {
					console.log(`Unable To Find Folder Configuration.`)
				}
			} else {
				let pull = require(`../slashCommands/${dir}`)
				if(pull.name && pull.description) {
					let sub = new SlashCommandBuilder().setName(String(pull.name).toLowerCase().replace(/\s+/g, '_')).setDescription(String(pull.description))
					if(pull.options && pull.options.length > 0) {
						for(option of pull.options) {
							if(option.type && option.name && option.description) {
								let type = option.type;
								let name = option.name;
								let description = option.description;
								let required = false;
								if(option.required && option.required == true) {
									required = true;
								}
								if(type == "String") {
									sub.addStringOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "User") {
									sub.addUserOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "Role") {
									sub.addRoleOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "Channel") {
									sub.addChannelOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "Integer") {
									sub.addIntegerOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "Attachment") {
									sub.addAttachmentOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required))
								}
								if(type == "StringChoices") {
									sub.addStringOption(option => option.setName(String(name).toLowerCase()).setDescription(String(description).toLowerCase()).setRequired(required).addChoices(...option.choices))
								}
							}
						}
					}
					allCommands.push(sub.toJSON())
					client.slashCommands.set("normal" + pull.name, pull)
				} else {
					console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightGreen);
				}
			}
		});
		// LOADING ALL COMMANDS INTO THE BOT.
		client.on("ready", async () => {
			if(config.loadSlashsGlobal == false) {
				const token = client.token;
				const rest = new REST({ version: 10 }).setToken(token);
				rest.put(Routes.applicationCommands(client.user.id), { body: [] })
				client.guilds.cache.forEach((guild) => {
					let guildId = guild.id;
					(async () => {
						try {
							const data = await rest.put(
								Routes.applicationGuildCommands(client.user.id, guildId),
								{ body: allCommands },
							);
							console.log(`${`Successfully`.bold.green} Loaded ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`${guild.name}`.brightRed}`);
						} catch (error) {
							console.log(`${`Unable`.bold.red} To Load ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`${guild.name}`.brightRed}`);
						}
					})();
				})
			}
			if(config.loadSlashsGlobal == true) {
				const token = client.token;
				const rest = new REST({ version: 10 }).setToken(token);
				client.guilds.cache.forEach((guild) => {
					let guildId = guild.id;
					rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: [] })
				})
				try {
					const data = await rest.put(
						Routes.applicationCommands(client.user.id),
						{ body: allCommands },
					);
					console.log(`${`Successfully`.bold.green} Loaded ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`ALL POSSIBLE GUILDS`.brightRed}`);
				} catch (error) {
					console.log(`${`Unable`.bold.red} To Load ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`ALL POSSIBLE GUILDS`.brightRed}`);
				}
			}
		})
		client.on("guildCreate", async (guild) => {
			try {
				if(!config.loadSlashsGlobal) {
					let guildId = guild.id;
					const token = client.token;
					const rest = new REST({ version: '10' }).setToken(token);
					(async () => {
						try {
							const data = await rest.put(
								Routes.applicationGuildCommands(client.user.id, guildId),
								{ body: allCommands },
							);
					
							console.log(`${`Successfully`.bold.green} Loaded ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`${guild.name}`.brightRed}`);
						} catch (error) {
							console.log(`${`Unable`.bold.red} To Load ${`(/)`.brightGreen} ${allCommands.length} Commands For: ${`${guild.name}`.brightRed}`);
						}
					})();
				}
			} catch (e) {
				console.log(String(e.stack).bgRed)
			}
		})
	} catch (e) {
		console.log(String(e.stack).bgRed)
	}
}
