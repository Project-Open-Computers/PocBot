import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Subcommand.Options>({
	name: 'news',
	description: 'Lets you subscribe to updates.',
	subcommands: [
		{
			name: 'subscribe',
			chatInputRun: 'chatInputSubscribe'
		},
		{
			name: 'unsubscribe',
			chatInputRun: 'chatInputUnsubscribe'
		}
	]
})
export class SubscribeCommand extends Subcommand {
	private async fetchRole(interaction: Subcommand.ChatInputInteraction, roleID: string) {
		const role = await interaction.guild?.roles.fetch(roleID);
		if (role === null || role === undefined) throw new Error(`Unable to find role by ${roleID}`);
		return role;
	}

	public async chatInputSubscribe(interaction: Subcommand.ChatInputInteraction) {
		const roleToFetch = interaction.options.getString('role', true);
		const role = await this.fetchRole(interaction, roleToFetch);

		const user = await interaction.guild?.members.fetch(interaction.user.id);
		if (user?.roles.cache.has(role?.id)) return interaction.reply(`You are already subscribed to ${role.name}`);
		await user?.roles.add(role);
		return interaction.reply(`You are now subscribed to ${role.name}`);
	}

	public async chatInputUnsubscribe(interaction: Subcommand.ChatInputInteraction) {
		const roleToFetch = interaction.options.getString('role', true);
		const role = await this.fetchRole(interaction, roleToFetch);

		const user = await interaction.guild?.members.fetch(interaction.user.id);
		if (user?.roles.cache.has(role?.id)) return interaction.reply(`You are not subscribed to ${role.name}`);
		await user?.roles.remove(role);
		return interaction.reply(`You have been unsubscribed from ${role.name}`);
	}

	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('subscribe')
							.setDescription('lets your subscribe to notifications')
							.addStringOption((option) =>
								option
									.setName('role')
									.setDescription('The role to subscribe to')
									.setChoices(
										{ name: 'Server updates (News Letter)', value: '805078371725869066' },
										{ name: 'Technical updates (Devlog Subscriber)', value: '944371601560969326' }
									)
									.setRequired(true)
							)
					)
					.addSubcommand((subcommand) =>
						subcommand
							.setName('unsubscribe')
							.setDescription('lets your subscribe to notifications')
							.addStringOption((option) =>
								option
									.setName('role')
									.setDescription('The role to unsubscribe to')
									.setChoices(
										{ name: 'Server updates (News Letter)', value: '805078371725869066' },
										{ name: 'Technical updates (Devlog Subscriber)', value: '944371601560969326' }
									)
									.setRequired(true)
							)
					),

			{ idHints: ['944769715836948520'], guildIds: ['561218560467271681'] }
		);
	}
}
