import './lib/setup';
import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
	logger: {
		level: LogLevel.Info
	},
	shards: 'auto',
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_INTEGRATIONS'],
	loadDefaultErrorListeners: true
});

(async () => {
	try {
		console.info('Logging in');
		await client.login();
		ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
		console.info(
			`Logged in! \n Invite Link: ${client.generateInvite({
				scopes: ['applications.commands', 'bot'],
				permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY', 'MANAGE_ROLES']
			})}`
		);
	} catch (error) {
		console.error(error);
		client.destroy();
		process.exit(1);
	}
})();
