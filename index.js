const Discord = require("discord.js");

require("dotenv").config();

const client = new Discord.Client();

client.once('ready', () => {
    console.log("Ready!");
});

client.on("message", message => {
    console.log(message.content);
});

client.login(process.env.DISCORD_BOT_TOKEN)
