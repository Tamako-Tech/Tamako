const request = require('node-superfetch');

module.exports = {
    name: 'giphy',
    aliases: ['gif'],
    description: 'Searches Giphy for your query.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[query]',
    run: async (client, message, [ ...query ], Discord) => {
        try {
            const { body } = await request
                .get('http://api.giphy.com/v1/gifs/search')
                .query({
                    q: query,
                    api_key: process.env.GIPHY_KEY,
                    rating: message.channel.nsfw ? 'r' : 'pg'
                });
            if (!body.data.length) return message.reply('Could not find any results.');
            return message.reply(body.data[Math.floor(Math.random() * body.data.length)].images.original.url);
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
