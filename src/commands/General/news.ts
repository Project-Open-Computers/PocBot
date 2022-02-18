import {ApplyOptions} from '@sapphire/decorators';
import {ApplicationCommandRegistry, Command, CommandOptions} from '@sapphire/framework';
import type {CommandInteraction} from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'subscribe',
    description: 'Lets you subscribe to updates.',
})
export class UserCommand extends Command {
    async chatInputRun(interaction: CommandInteraction) {
        const action = interaction.options.getString('action');

        // Check roles of user and search for role ID
        const role = await interaction.guild?.roles.cache.find(r => r.id === '805078371725869066');
        if (role === undefined) {
            throw new Error('NEWS Role not found');
        }
        const user = await interaction.guild?.members.fetch(interaction.user.id);
        const userHasNewsRole = user?.roles.cache.has(role?.id);
        switch (action) {
            case 'subscribe':
                if (userHasNewsRole){
                    await interaction.reply('You are already subscribed to news');
                }
                user?.roles.add(role);
                await interaction.reply('You are now subscribed to news');
                break;

            case 'unsubscribe':
                if (!userHasNewsRole) {
                    await interaction.reply('You are not subscribed to news');
                }
                user?.roles.remove(role);
                await interaction.reply('You have been unsubscribed from news');
                break;
        }
    }


    registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name).setDescription(this.description).addStringOption(option =>
                option
                    .setName('action')
                    .setDescription('Lets you subscribe/ unsubscribe to a updates')
                    .setChoices([
                        ['Subscribe to updates (news)', 'subscribe'],
                        ['Unsubscribe from updates (news)', 'unsubscribe'],
                    ])
                    .setRequired(true)
            ), {idHints: ['944349656262017024']}
        );
    }
}