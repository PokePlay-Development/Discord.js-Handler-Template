module.exports = {
  name: `ping`,
  run: async (client, message, args) => {
    return message.reply({ content: `Pong! My Ping is **${client.ws.ping}ms**` })
  }
}
