const request = require('node-superfetch');

module.exports = {
    name: 'danbooru',
    aliases: [],
    description: 'Responds with an image from Danbooru, with optional query.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[query]',
    run: async (client, message, [ query ], container) => {
        if (!message.channel.nsfw) return message.reply('Please use this in an nsfw channel');
        if (!query) return message.reply('You must provide a query!');
        try {
            const { body } = await request
                .get('https://danbooru.donmai.us/posts.json')
                .query({
                    tags: `${query} order:random`,
                    limit: 1
                });
            if (!body.length || !body[0].file_url) return message.reply('Could not find any results.');
            return message.reply(body[0].file_url);
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
