/**
 * Extract the ID from a mention of the form <@[!]##################> (!
 * is optional) or from an ID of the form ##################
 * @param original The mention or ID to extract the ID from
 * @returns the extracted ID if found else undefined
 */
export function extractUserFrom(original: string) {
  const simpleIDRegex = /^(\d+)$/;
  const mentionRegex = /^<@!?(\d+)>$/;

  const idMatch = original.match(simpleIDRegex);
  if (idMatch) {
    return idMatch[1];
  }

  const mentionMatch = original.match(mentionRegex);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  return undefined;
}

/**
 * Generate a random integer within a range
 * @param min the inclusive minimum number
 * @param max the exclusive maximum number
 * @returns a random integer in [min, max)
 */
export function randInt(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
