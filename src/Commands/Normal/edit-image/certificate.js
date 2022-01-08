const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');

module.exports = {
    name: 'certificate',
    aliases: [],
    description: 'Draws an image with the Brazzers logo in the corner.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[name of the person]',
    run: async (client, message, [ name ], Discord) => {
        name = name || message.author.username;
        await message.reply('Give a reason for the award');
          
        const msg_filter = (m) => m.author.id === message.author.id;
        const reason = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => collected.first().content)
            .catch(() => {
                return message.reply('You took too long to respond, please try again.');
            });
        try {
            const base = await loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'certificate.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '30px oldengl';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.fillText(reason, 518, 273);
            ctx.fillText(name, 518, 419);
            ctx.fillText(moment().format('MM/DD/YYYY'), 309, 503);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://certificate.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: canvas.toBuffer(), name: 'certificate.png' }] });
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
