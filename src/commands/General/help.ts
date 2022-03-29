import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';

import type { CommandInteraction, MessageEmbed } from 'discord.js';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'The help command for no reason other than to be helpful.',
	detailedDescription: ''
})
export class StatsCommand extends Command {
	chatInputRun(interaction: CommandInteraction) {
		const commands = this.container.stores.get('commands');
		const paginatedMessage = new PaginatedMessage();
		paginatedMessage.addPageEmbed((embed: MessageEmbed) => {
			return embed
				.setTitle('Commands')
				.setDescription(
					commands
						.map(command => `**${command.name}** - ${command.description}`)
						.join('\n')
				);
		});

		return paginatedMessage.run(interaction);
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		}, { idHints: ['958463152981409862'], guildIds: ['561218560467271681']});
	}
}
