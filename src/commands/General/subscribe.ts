import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'subscribe',
	description: 'Lets you subscribe to updates.'
})
export class SubscribeCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const action = interaction.options.getString('action');
		const roleToFetch = interaction.options.getString('role');

		// Check roles of user and search for role ID
		const role = await interaction.guild?.roles.cache.find((r) => r.id === roleToFetch);
		if (role === undefined) {
			throw new Error('Role not found');
		}
		const user = await interaction.guild?.members.fetch(interaction.user.id);
		const userHasNewsRole = user?.roles.cache.has(role?.id);
		switch (action) {
			case 'subscribe':
				if (userHasNewsRole) {
					await interaction.reply(`You are already subscribed to ${role.name}`);
				}
				user?.roles.add(role);
				await interaction.reply(`You are now subscribed to ${role.name}`);
				break;

			case 'unsubscribe':
				if (!userHasNewsRole) {
					await interaction.reply(`You are not subscribed to ${role.name}`);
				}
				user?.roles.remove(role);
				await interaction.reply(`You have been unsubscribed from ${role.name}`);
				break;
		}
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('action')
							.setDescription('Lets you subscribe/ unsubscribe to a updates')
							.setChoices([
								['Subscribe to updates (news)', 'subscribe'],
								['Unsubscribe from updates (news)', 'unsubscribe']
							])
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName('role')
							.setDescription('The role to subscribe/ unsubscribe to')
							.setChoices([
								['Server updates (News Letter)', '805078371725869066'],
								['Technical updates (Devlog Subscriber)', '944371601560969326']
							])
							.setRequired(true)
					),

			{ idHints: ['944769715836948520'], guildIds: ['561218560467271681'] }
		);
	}
}
