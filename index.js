const Discord = require("discord.js");

require("dotenv").config();

const client = new Discord.Client();

const prefix = ">>"

client.once('ready', () => {
    console.log("Ready!");
});

client.on("message", async message => {
    if (message.content == `${prefix}hello`) {
        await message.channel.send(`Hello ${message.author.username}`);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN)
