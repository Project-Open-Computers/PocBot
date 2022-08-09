import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'subscribe',
	description: 'Lets you subscribe to updates.'
})
export class SubscribeCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		const action = interaction.options.getString('action');
		const roleToFetch = interaction.options.getString('role');

		// Check roles of user and search for role ID
		const role = interaction.guild?.roles.cache.find((r) => r.id === roleToFetch);
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
				await user?.roles.add(role);
				return interaction.reply(`You are now subscribed to ${role.name}`);

			case 'unsubscribe':
				if (!userHasNewsRole) {
					await interaction.reply(`You are not subscribed to ${role.name}`);
				}
				await user?.roles.remove(role);
				return interaction.reply(`You have been unsubscribed from ${role.name}`);
		}
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('action')
							.setDescription('Lets you subscribe/ unsubscribe to a updates')
							.setChoices(
								{ name: 'Subscribe to updates (news)', value: 'subscribe' },
								{ name: 'Unsubscribe from updates (news)', value: 'unsubscribe' }
							)
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName('role')
							.setDescription('The role to subscribe/ unsubscribe to')
							.setChoices(
								{ name: 'Server updates (News Letter)', value: '805078371725869066' },
								{ name: 'Technical updates (Devlog Subscriber)', value: '944371601560969326' }
							)
							.setRequired(true)
					),

			{ idHints: ['944769715836948520'], guildIds: ['561218560467271681'] }
		);
	}
}
