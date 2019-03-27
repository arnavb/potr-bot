var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const name = 'hello';
export const description = 'Say hello to someone!';
export const group = 'General';
export const usage = '[arg...]';
/**
 * @param {import("discord.js").Message} message
 * @param {Array<string>} commandArgs
 */
export function execute(message, commandArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commandArgs.length === 0) {
            yield message.channel.send(`Hello, ${message.author.username}!`);
        }
        else {
            yield message.channel.send(`Hello, ${commandArgs.join(' ')}!`);
        }
    });
}
//# sourceMappingURL=hello.js.map