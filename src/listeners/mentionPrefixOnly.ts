import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Events } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCreate
})
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot) return;
		if (message.channel.id === '800404487058489394') {
			// votes channel
			await message.react('☑️');
			await message.react('🇽');
			return;
		}
	}
}
