const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { centerImage } = require(join(__dirname, '../../../Functions/canvas'));
const { validate, parse } = require(join(__dirname, '../../../Functions/types/image-or-avatar'));

module.exports = {
    name: 'approved',
    aliases: ['approve'],
    description: 'Draws an "approved" stamp over an image or a user\'s avatar.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[user/image]',
    run: async (client, message, [ image ], Discord) => {
        if (!image) return message.reply('Please provide an image or avatar to use this command.');
        if (!validate(image, message)) return message.reply('Please provide an image or avatar to use this command.');
        image = await parse(image, message);

        try {
            const base = await loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'approved.png'));
            const { body } = await request.get(image);
            const data = await loadImage(body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const { x, y, width, height } = centerImage(base, data);
            ctx.drawImage(base, x, y, width, height);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Tamako Approves')
                .setImage('attachment://approved.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment, name: 'approved.png' }] });
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
