const request = require('node-superfetch');

module.exports = {
    name: 'flickr',
    aliases: [],
    description: 'Searches Flickr for your query... Maybe.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[query]',
    run: async (client, message, [ ...query ], container) => {
        if (!query) return message.reply('You must provide a query!');
        try {
            const { body } = await request
                .get('https://api.flickr.com/services/rest/')
                .query({
                    api_key: process.env.FLICKR_KEY,
                    format: 'json',
                    method: 'flickr.photos.search',
                    text: query.join(' '),
                    nojsoncallback: true
                });
            if (!body.photos.photo.length) return message.reply('Could not find any results.');
            const data = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
            return message.reply(`https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}.jpg`);
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
