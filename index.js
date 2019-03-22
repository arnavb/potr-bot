const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

const prefix = '>>';

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot || message.content.trim().length === prefix.length) {
    return;
  }

  const commandArgs = message.content.slice(prefix.length).split(/ +/);
  const command = commandArgs.shift();

  if(command == 'hello') {
    if (commandArgs.length === 0) {
      await message.channel.send(`Hello ${message.author.username}`);
    } else {
      await message.channel.send(`Hello ${commandArgs.join(', ')}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
