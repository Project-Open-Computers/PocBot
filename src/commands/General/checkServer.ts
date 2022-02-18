import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@ApplyOptions<CommandOptions>({
	name: 'checkServer',
	description: 'A basic command with some subcommands',
	chatInputCommand: {
		register: true
	}
})
export class checkServerCommand extends Command {
	async chatInputRun(interaction: CommandInteraction) {
		const serverToCheck = interaction.options.getString('server');
		this.container.logger.info(`Checking server ${serverToCheck}.bloodcoffeegames.com`);
		const serverData = await fetch<ServerData>(`https://api.mcsrvstat.us/2/${serverToCheck}.bloodcoffeegames.com`, FetchResultTypes.JSON);

		const serverInfoEmbed = new MessageEmbed() //
			.setTitle('Here Is The Server Status')
			.addField('Status: ', `The server is currently ${serverData.online ? 'online' : 'offline'}`, true)
			.addField('Total Online Players: ', serverData?.players?.online ? serverData?.players?.online.toString() : 'None', false)
			.addField('MOTD: ', serverData?.motd?.clean ? serverData?.motd?.clean.join(' ') : 'Server is offline!', true)
			.addField('Online Players: ', serverData?.players?.list?.length > 0 ? serverData.players.list.join(', \n') : 'None', false)
			.setColor('BLUE');

		return interaction.reply({ embeds: [serverInfoEmbed] });
	}

	registerApplicationCommands(registry: ApplicationCommandRegistry) {
		console.log('called registerApplicationCommands', this.name);
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('server')
							.setDescription('The server to check')
							.setChoices([
								['poc3.bloodcoffeegames.com', 'poc3'],
								['poc3c.bloodcoffeegames.com', 'poc3c']
							])
							.setRequired(true)
					),
			{ idHints: ['944252998316621864'] }
		);
	}
}

interface ServerData {
	ip: string;
	port: number;
	debug: Debug;
	motd: MOTD;
	players: Players;
	version: string;
	online: boolean;
	protocol: number;
	hostname: string;
	icon: string;
	mods: Mods;
}

interface Debug {
	ping: boolean;
	query: boolean;
	srv: boolean;
	querymismatch: boolean;
	ipinsrv: boolean;
	cnameinsrv: boolean;
	animatedmotd: boolean;
	cachetime: number;
	apiversion: number;
}

interface Mods {
	names: string[];
	raw: { [key: string]: string };
}

interface MOTD {
	raw: string[];
	clean: string[];
	html: string[];
}

interface Players {
	list: string[];
	online: number;
	max: number;
}
