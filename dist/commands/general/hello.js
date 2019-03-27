"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'hello';
exports.description = 'Say hello to someone!';
exports.group = 'General';
exports.usage = '[arg...]';
function execute(message, commandArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commandArgs.length === 0) {
            yield message.channel.send(`Hello, ${message.author.username}!`);
        }
        else {
            yield message.channel.send(`Hello, ${commandArgs.join(' ')}!`);
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=hello.js.map