const fs = require('fs');

const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = '>>';

const commandGroups = ['general'];

// TODO: Add support for loading commands from directories
// let allCommands = [];

// for (const group of commandGroups) {

// }

client.once('ready', () => {
  console.log(
    `Logging in with ${client.user.username}#${client.user.discriminator}`,
  );
});

client.on('message', async message => {
  if (message.content == `${prefix}hello`) {
    await message.channel.send(`Hello ${message.author.username}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
