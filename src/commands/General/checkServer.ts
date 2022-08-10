import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { fetch, FetchResultTypes } from '@sapphire/fetch';

@ApplyOptions<CommandOptions>({
	name: 'checkServer',
	description: 'A basic command with some subcommands'
})
export class checkServerCommand extends Command {
	async chatInputRun(interaction: Command.ChatInputInteraction) {
		const serverToCheck = interaction.options.getString('server');
		this.container.logger.info(`Checking ${serverToCheck}`);
		const serverData = await fetch<ServerData>(`https://api.mcsrvstat.us/2/${serverToCheck}`, FetchResultTypes.JSON);

		const serverInfoEmbed = new MessageEmbed()
			.setTitle(`Server Info for ${serverToCheck}`)
			.addFields([
				{
					name: 'Status: ',
					value: `The server is currently ${serverData.online ? 'online' : 'offline'}`
				},
				{
					name: 'Total Online Players: ',
					value: serverData?.players?.online ? serverData?.players?.online.toString() : 'None'
				},
				{
					name: 'MOTD: ',
					value: serverData?.motd?.clean ? serverData?.motd?.clean.join(' ') : 'Server is offline!'
				},
				{
					name: 'Online Players: ',
					value: serverData?.players?.list?.length > 0 ? serverData.players.list.join(', \n') : 'None'
				}
			])
			.setColor('BLUE');

		return interaction.reply({ embeds: [serverInfoEmbed] });
	}

	registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('server')
							.setDescription('The server to check')
							.setChoices(
								{
									name: 'Project OpenComputers 3',
									value: 'poc3.namelessserver.net'
								},
								{
									name: 'Warpy',
									value: 'warpy.namelessserver.net'
								}
							)
							.setRequired(true)
					),
			{ idHints: ['944423305039999026'], guildIds: ['561218560467271681'] }
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
