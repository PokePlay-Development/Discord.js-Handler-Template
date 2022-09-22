const { SlashCommandBuilder, REST, Routes } = require("discord.js")
const config = require("../settings.json")
const folderConfig = config.slashCommandsDirs;
const { readdirSync, lstatSync } = require("node:fs");
module.exports = async (client) => {
	try {
		let allCommands = new Array();
		readdirSync(`${process.cwd()}/slashCommands/`).forEach((dir) => {
			if(lstatSync(`${process.cwd()}/slashCommands/${dir}`).isDirectory()) {
				let cmdSetup = folderConfig.find(r => r.Folder == dir)
				if(!cmdSetup) return;
				if(cmdSetup) {
					const subCommand = new SlashCommandBuilder().setName(cmdSetup.CmdName.america.replace(/\s+/g, "_")).setDescription(cmdSetup.CmdDescription);
					const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
					for(let file of slashCommands) {
						let pull = require(`../slashCommands/${dir}/${file}`);
						if(pull.name && pull.description) {
							subCommand.addSubcommand((sub) => {
								sub.setName(String(pull.name)).setDescription(pull.description)
								if(pull.options && pull.options.length > 0) {
									for(option of pull.options) {
										if(option.type && option.name && option.description) {
											let type = option.type;
											let name = option.name.replace(/\s+/g, "_").toLowerCase();
											let required = false;
											if(option.required && option.required == true) {
												required = true
											}
											if(type == "User") {
												sub.addUserOption((op) => {
													op.setName(name).setDescription(option.description).setRequired(required)
												})
											}
											if(type == "Integer") {
												sub.addIntegerOption((op) => {
													op.setName(name).setDescription(option.description).setRequired(required)
												})
											}
											if(type == "String") {
												sub.addStringOption((op) => {
													op.setName(name).setDescription(option.description).setRequired(required)
												})
											}
											if(type == "Channel") {
												sub.addChannelOption((op) => {
													op.setName(name).setDescription(option.description).setRequired(required)
												})
											}
											if(type == "Role") {
												sub.addRoleOption((op) => {
													op.setName(name).setDescription(option.description).setRequired(required)
												})
											}
											if(type == "Choices") {
												if(option.choices && option.choices.length > 0) {
													sub.addStringOption((op) => {
														op.setName(name).setDescription(option.description).setRequired(required)
														option.choices.forEach(choice => {
															op.addChoices(
																{ name: `${choice.name}`, value: `${choice.description}`}
															)
														})
													})
												}
											} else {
												console.log(`[HANDLER]`.bold.red, "Uknown", "InteractionCommandOption".brightRed, "Provided.")
											}
										} else {
											console.log(`Unable To Add option.`)
										}
									}
								}
								return subCommand;
							})
							client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
						} else {
							console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightGreen);
							continue;
						}
					}
					allCommands.push(subCommand.toJSON())
				} else {
					console.log(`Unable TO Find Folder Configuration.`)
				}
			} else {
				let pull = require(`../slashCommands/${dir}`)
				if(pull.name && pull.description) {
					let sub = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(String(pull.description))
					if(pull.options && pull.options.length > 0) {
						for(option of pull.options) {
							if(option.type && option.name && option.description) {
								let type = option.type;
								let name = option.name.replace(/\s+/g, "_").toLowerCase();
								let required = false;
								if(option.required && option.required == true) {
									required = true
								}
								if(type == "User") {
									sub.addUserOption((op) => {
										op.setName(name).setDescription(option.description).setRequired(required)
									})
								}
								if(type == "Integer") {
									sub.addIntegerOption((op) => {
										op.setName(name).setDescription(option.description).setRequired(required)
									})
								}
								if(type == "String") {
									sub.addStringOption((op) => {
										op.setName(name).setDescription(option.description).setRequired(required)
									})
								}
								if(type == "Channel") {
									sub.addChannelOption((op) => {
										op.setName(name).setDescription(option.description).setRequired(required)
									})
								}
								if(type == "Role") {
									sub.addRoleOption((op) => {
										op.setName(name).setDescription(option.description).setRequired(required)
									})
								}
								if(type == "Choices") {
									if(option.choices && option.choices.length > 0) {
										sub.addStringOption((op) => {
											op.setName(name).setDescription(option.description).setRequired(required)
											option.choices.forEach(choice => {
												op.addChoices(
													{ name: `${choice.name}`, value: `${choice.description}`}
												)
											})
										})
									}
								} else {
									console.log(`[HANDLER]`.bold.red, "Uknown", "InteractionCommandOption".brightRed, "Provided.")
								}
							} else {
								console.log(`Unable To Add option.`)
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
