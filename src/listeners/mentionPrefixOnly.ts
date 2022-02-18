import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserEvent extends Listener<'chatInputRun'> {
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
