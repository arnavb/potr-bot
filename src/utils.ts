/**
 * Extract the #'s from a mention of the form <@[!]##################> (!
 * is optional)
 * @param mention The mention to extract the ID from
 */
export function extractIDFromMention(mention: string) {
  const mentionRegex = /^<@!?(\d+)>$/;

  const match = mention.match(mentionRegex);

  return match ? match[1] : undefined;
}
