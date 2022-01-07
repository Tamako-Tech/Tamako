const { join } = require('path');
const request = require('node-superfetch');
const {  shorten } = require(join(__dirname, '../../../Functions/Utils'));

module.exports = {
    name: 'bulbapedia',
    aliases: [],
    description: 'Searches Bulbapedia for your query.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[query]',
    run: async (client, message, [ ...query ], Discord) => {
        if (!query) return message.reply('You must provide a query!');
        query = query.join(' ');
        try {
            const { body } = await request
                .get('https://bulbapedia.bulbagarden.net/w/api.php')
                .query({
                    action: 'query',
                    prop: 'extracts|pageimages',
                    format: 'json',
                    titles: query,
                    exintro: '',
                    explaintext: '',
                    pithumbsize: 150,
                    redirects: '',
                    formatversion: 2
                });
            const data = body.query.pages[0];
            if (data.missing) return message.reply('Could not find any results.');
            const embed = new Discord.MessageEmbed()
                .setColor(0x3E7614)
                .setTitle(data.title)
                .setAuthor('Bulbapedia', 'https://i.imgur.com/ePpoeFA.png', 'https://bulbapedia.bulbagarden.net/')
                .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
                .setURL(`https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(query).replaceAll(')', '%29')}`)
                .setDescription(shorten(data.extract.replaceAll('\n', '\n\n')))
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
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
