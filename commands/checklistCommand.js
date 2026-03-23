const {
	EmbedBuilder,
	SlashCommandBuilder
} = require('discord.js');
const { getConfig } = require('../functions/runtimeConfig.js');
const NewChecklist = require('../functions/newChecklist.js');

const config = getConfig();

function formatDuration(durationMs) {
	const totalSeconds = Math.floor(durationMs / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return [days ? `${days}d` : null, hours ? `${hours}h` : null, minutes ? `${minutes}m` : null, `${seconds}s`].filter(Boolean).join(' ');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName((config.checklistCommand).toLowerCase().replaceAll(/[^a-z0-9]/gi, '_'))
		.setDescription(`Create new checklist`)
		.addSubcommand(subcommand =>
			subcommand
			.setName('custom')
			.setDescription('Create your own checklist'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('premade')
			.setDescription('Use premade checklist'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('status')
			.setDescription('Show bot runtime status')),

	async execute(client, interaction) {
		if (interaction.options.getSubcommand() === 'custom') {
			NewChecklist.modalChecklistNew(client, interaction);
		} else if (interaction.options.getSubcommand() === 'premade') {
			NewChecklist.selectPremadeChecklist(client, interaction);
		} else if (interaction.options.getSubcommand() === 'status') {
			const statusEmbed = new EmbedBuilder()
				.setTitle('ChecklistBot Status')
				.setColor('00AA55')
				.addFields(
					{ name: 'State', value: 'Online', inline: true },
					{ name: 'Latency', value: `${client.ws.ping} ms`, inline: true },
					{ name: 'Uptime', value: formatDuration(client.uptime || 0), inline: true },
					{ name: 'Guilds', value: String(client.guilds.cache.size), inline: true },
					{ name: 'User', value: client.user ? client.user.tag : 'Unknown', inline: true },
					{ name: 'Command', value: `/${config.checklistCommand}`, inline: true }
				);

			await interaction.reply({
				embeds: [statusEmbed],
				ephemeral: true
			});
		}
	}, //End of execute()
};
