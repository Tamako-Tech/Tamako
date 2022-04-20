const { join } = require('path');
const request = require('node-superfetch');
const { formatNumber } =  require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'covid-19',
    aliases: ['coronavirus', 'corona', 'covid'],
    description: 'Responds with stats for COVID-19.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '',
    run: async (client, message, [country], container) => {
        if (!country) country = 'all';
        country = country.toLowerCase()
        country = encodeURIComponent(country)
        try {
            const data = await fetchStats(country);
            const embed = new container.Discord.MessageEmbed()
                .setTitle(`Stats for ${country === 'all' ? 'The World' : data.country}`)
                .setColor(0x2E528E)
                .setAuthor({ name: 'Worldometers', iconURL: 'https://i.imgur.com/IoaBMuK.png', url: 'https://www.worldometers.info/coronavirus/'})
                .setURL(country === 'all'
					? 'https://www.worldometers.info/coronavirus/'
					: `https://www.worldometers.info/coronavirus/country/${data.countryInfo.iso2}/`)
				.setThumbnail(country === 'all' ? null : data.countryInfo.flag || null)
                .setTimestamp(data.updated)
                .addField('❯ Total Cases', `${formatNumber(data.cases)} (${formatNumber(data.todayCases)} Today)`, true)
				.addField('❯ Total Deaths', `${formatNumber(data.deaths)} (${formatNumber(data.todayDeaths)} Today)`, true)
				.addField('❯ Total Recoveries',
					`${formatNumber(data.recovered)} (${formatNumber(data.todayRecovered)} Today)`, true)
				.addField('❯ Active Cases', formatNumber(data.active), true)
				.addField('❯ Active Critical Cases', formatNumber(data.critical), true)
				.addField('❯ Tests', formatNumber(data.tests), true)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
				
            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

async function fetchStats(country) {
    const { body } = await request
        .get(`https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`);
    return body;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
