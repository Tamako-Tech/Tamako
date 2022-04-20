const { join } = require('path');
const request = require('node-superfetch');
const { formatNumber } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'country',
    aliases: [],
    description: 'Responds with information on a country.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[query]',
    run: async (client, message, [ query ], container) => {
        if (!query) return message.reply('You must provide a query!');
        query = query.join(' ');
        try {
            const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${encodeURIComponent(query)}`);
			const data = body.find(country => {
				const search = query.toLowerCase();
				return country.name.toLowerCase() === search
					|| country.altSpellings.some(alt => alt.toLowerCase() === search)
					|| country.alpha2Code.toLowerCase() === search
					|| country.alpha3Code.toLowerCase() === search
					|| country.nativeName.toLowerCase() === search;
			}) || body[0];
            const embed = new container.Discord.MessageEmbed()
			    .setColor(0x00AE86)
				.setTitle(data.name)
				.setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
                .addField('❯ Population', formatNumber(data.population), true)
				.addField('❯ Capital', data.capital || 'None', true)
				.addField('❯ Currency', data.currencies[0].symbol, true)
				.addField('❯ Location', data.subregion || data.region, true)
				.addField('❯ Demonym', data.demonym || 'None', true)
				.addField('❯ Native Name', data.nativeName, true)
				.addField('❯ Area', `${formatNumber(data.area)}km`, true)
				.addField('❯ Languages', data.languages.map(lang => lang.name).join('/'))
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            if (err.status === 404) return msg.reply('Could not find any results.');
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
