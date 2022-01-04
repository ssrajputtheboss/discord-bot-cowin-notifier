require('dotenv').config();
const TOKEN = process.env.TOKEN;
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.content.startsWith('..')) {
    message
      .reply(message.content.replace('..', ''))
      .then((msg) => {
        message.delete();
      })
      .catch((err) => {});
  }
});

client.login(TOKEN);
