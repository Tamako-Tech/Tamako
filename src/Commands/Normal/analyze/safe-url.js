const request = require('node-superfetch');

module.exports = {
    name: 'safe-url',
    aliases: ['check-url', 'safe-browsing', 'virus', 'safe-link', 'check-link'],
    description: 'Determines if a URL is safe or not.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[url]',
    run: async (client, message, [ url ], Discord) => {   
        if (!url) return message.reply('Please provide a URL.');
        try {
            const { body } = await request
                .post('https://safebrowsing.googleapis.com/v4/threatMatches:find')
                .query({ key: process.env.GOOGLE_KEY })
                .send({
                    client: {
                        clientId: 'tamako-discord',
                        clientVersion: '1.0.0'
                    },
                    threatInfo: {
                        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
                        platformTypes: ['ANY_PLATFORM'],
                        threatEntryTypes: ['URL'],
                        threatEntries: [{ url }]
                    }
                });

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('👍 Good to go! This link is safe!')
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (!body.matches) return message.reply({ embeds: [embed] });

            embed.setColor('RED').setDescription('⚠️ This link is unsafe! **Do not click it!** ⚠️');

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
