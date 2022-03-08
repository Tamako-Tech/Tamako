const { join } = require('path');
const request = require('node-superfetch');
const { shorten, formatNumber } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'book',
    aliases: ['google-book', 'google-books'],
    description: 'Searches for a book on Google Books.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[name]',
    run: async (client, message, [ ...query ], container) => {
        if (!query) return message.reply('You must provide a query!');
        query = query.join(' ');
        try {
            const { body } = await request
                .get('https://www.googleapis.com/books/v1/volumes')
                .query({
                    apiKey: process.env.GOOGLE_KEY,
                    q: query,
                    maxResults: 1,
                    printType: 'books'
                });
            if (!body.items) return message.reply('Could not find any results.');
            const data = body.items[0].volumeInfo;
            const embed = new container.Discord.MessageEmbed()
                .setColor(0x4285F4)
                .setTitle(data.title)
                .setURL(data.previewLink)
                .setAuthor('Google Books', 'https://i.imgur.com/N3oHABo.png', 'https://books.google.com/')
                .setDescription(data.description ? shorten(data.description) : 'No description available.')
                .setThumbnail(data.imageLinks ? data.imageLinks.thumbnail : null)
                .addFields(
                    { name: '❯ Authors', value: data.authors.length ? data.authors.join(', ') : '???' },
                    { name: '❯ Publish Date', value: data.publishedDate || '???', inline: true },
                    { name: '❯ Page Count', value: data.pageCount ? formatNumber(data.pageCount) : '???', inline: true}
                )
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
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
