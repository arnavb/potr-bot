/**
 * Get first user mentioned in a message (usually as a command parameter)
 * @param message The original Discord message
 * @param commandArgs The arguments of the command
 */
export function getFirstUser(message: import('discord.js').Message, commandArgs: string[]) {
  return message.mentions.members.first() || message.guild.member(commandArgs[0]);
}
