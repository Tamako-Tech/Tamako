const { join } = require('path');
const request = require('node-superfetch');
const { shorten } = require(join(__dirname, '../../../Functions/Utils'));

module.exports = {
    name: 'apod',
    aliases: ['astronomy-picture-of-the-day'],
    description: 'Responds with today\'s Astronomy Picture of the Day.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '',
    run: async (client, message, args, Discord) => {
        try {
            const { body } = await request
                .get('https://api.nasa.gov/planetary/apod')
                .query({ api_key: process.env.APOD_KEY });
            const embed = new Discord.MessageEmbed()
                .setTitle(body.title)
                .setDescription(shorten(body.explanation))
                .setColor(0x2E528E)
                .setAuthor(
                    'Astronomy Picture of the Day',
                    'https://i.imgur.com/Wh8jY9c.png',
                    'https://apod.nasa.gov/apod/astropix.html'
                )
                .setImage(body.media_type === 'image' ? body.url : null)
                .setURL(body.url)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
				
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
