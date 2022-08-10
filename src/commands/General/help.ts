import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import type { MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'The help command for no reason other than to be helpful.',
	detailedDescription: ''
})
export class StatsCommand extends Command {
	public override chatInputRun(interaction: Command.ChatInputInteraction) {
		const commands = this.container.stores.get('commands');
		const paginatedMessage = new PaginatedMessage();
		paginatedMessage.addPageEmbed((embed: MessageEmbed) => {
			return embed.setTitle('Commands').setDescription(commands.map((command) => `**${command.name}** - ${command.description}`).join('\n'));
		});

		return paginatedMessage.run(interaction);
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description
			},
			{ idHints: ['958463152981409862'], guildIds: ['561218560467271681'] }
		);
	}
}
