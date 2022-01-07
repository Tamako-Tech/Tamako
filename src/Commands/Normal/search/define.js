const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'define',
    aliases: [],
    description: 'Defines a word or phrase using the Merriam-Webster API.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '<word>',
    run: async (client, message, [ ...word ], Discord) => {
        word = encodeURIComponent(word);
        try {
            const { body } = await request
                .get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
                .query({ key: process.env.WEBSTER_KEY });
            if (!body.length) return message.reply('Could not find any results.');
            const data = body[0];
            if (typeof data === 'string') return message.reply(`Could not find any results. Did you mean **${data}**?`);
            return message.reply(stripIndents`
				**${data.meta.stems[0]}** (${data.fl})
				${data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')}
			`);
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
