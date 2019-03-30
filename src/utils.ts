/**
 * Extract the #'s from a mention of the form <@[!]##################> (!
 * is optional)
 * @param mention The mention
 */
export function extractIDFromMention(mention: string) {
    const mentionRegex = /^<@!?(\d+)>$/;

    const match = mention.match(mentionRegex);

    if (match) {
        return match[1];
    }

    return undefined;
}
