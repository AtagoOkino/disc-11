import { isUserInTheVoiceChannel, isMusicQueueExists, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { BaseCommand } from "../structures/BaseCommand";
import { loopMode } from "../structures/ServerQueue";
import { createEmbed } from "../utils/createEmbed";
import { Message } from "discord.js";

@DefineCommand({
    aliases: ["loop", "music-repeat", "music-loop"],
    description: "Repeat current music or the queue",
    name: "repeat",
    usage: "{prefix}repeat [all | one | off]"
})
export class RepeatCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicQueueExists()
    @isSameVoiceChannel()
    public execute(message: Message, args: string[]): any {
        const modeTypes = ["OFF", "ONE", "ALL"];
        const modeEmoji = ["▶", "🔂", "🔁"];
        if (!args[0]) {
            return message.channel.send(
                createEmbed("info", `${modeEmoji[message.guild!.queue!.loopMode]} **|** Lặp lại brr brr **\`${modeTypes[message.guild!.queue!.loopMode]}\`**`)
            );
        }

        const mode = args[0] as keyof typeof loopMode;

        if (loopMode[mode] as any === undefined || !isNaN(Number(mode))) {
            message.channel.send(createEmbed("error", `Lỗi, vui lòng dùng **\`${this.client.config.prefix}help ${this.meta.name}\`** để biết thêm thông tin chi tiết.`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        } else {
            message.guild!.queue!.loopMode = loopMode[mode];
            message.channel.send(createEmbed("info", `${modeEmoji[message.guild!.queue!.loopMode]} **|** Chuyển chế độ lặp lại sang **\`${modeTypes[message.guild!.queue!.loopMode]}\`**`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
    }
}
