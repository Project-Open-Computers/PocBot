import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'ping',
	description: 'Pong!',
	detailedDescription: 'ping'
})
export class PingCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.reply('Pinging...');
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			Date.now() - interaction.createdTimestamp
		}ms.`;

		return interaction.editReply(content);
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			idHints: ['561218560467271681'],
			guildIds: ['561218560467271681']
		});
	}
}
