import { ApplyOptions } from '@sapphire/decorators';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Command, CommandOptions } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pong!',
	detailedDescription: 'ping'
})
export class PingCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const msg = await interaction.reply({
			fetchReply: true,
			content: 'Pinging...'
		});
		if (isMessageInstance(msg)) {
			const diff = msg.createdTimestamp - interaction.createdTimestamp;
			const ping = Math.round(this.container.client.ws.ping);
			return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
		}

		return interaction.editReply('Sorry something went wrong. Please try again.');
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['561218560467271681'],
			guildIds: ['561218560467271681']
		});
	}
}
