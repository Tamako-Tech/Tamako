const request = require('node-superfetch');

module.exports = {
    name: 'derpibooru',
    aliases: [],
    description: 'Responds with an image from Derpibooru.',
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
            const url = await search(query, message.channel.nsfw || false);
            if (!url) return message.reply('Could not find any results.');
            if (url === 'nsfw') return message.reply('The image I found was NSFW, and this isn\'t the channel for that.');
            return message.reply(url);
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

async function search(query, nsfw) {
    const { body } = await request
        .get('https://derpibooru.org/api/v1/json/search')
        .query({
            q: query,
            per_page: 1,
            sf: 'random'
        });
    if (!body || !body.images || !body.images.length) return null;
    const image = body.images[0];
    if (!image.tags.includes('safe') && !nsfw) return 'nsfw';
    return image.representations.full;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
