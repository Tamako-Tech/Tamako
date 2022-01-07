const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const { wrapText  } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'caution',
    aliases: ['caution-sign'],
    description: 'Creates a caution sign with the text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[text]',
    run: async (client, message, [ ...text ], Discord) => {
        if (!text) return message.reply('Please provide a user or image to use this command.');
        text = text.join(' ');
        if (text > 500) return message.reply('Please provide a text less than 500 characters.');
        try {
            const base = await loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'caution.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = '60px Noto Bold';
            let fontSize = 60;
            while (ctx.measureText(text).width > 3311) {
                fontSize--;
                ctx.font = `${fontSize} Noto Bold`;
            }
            const lines = await wrapText(ctx, text.toUpperCase(), 895);
            const topMost = 470 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 20) * i);
                ctx.fillText(lines[i], base.width / 2, height);
            }
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://caution.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: canvas.toBuffer(), name: 'caution.png' }] });
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
