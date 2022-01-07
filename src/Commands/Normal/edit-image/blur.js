const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/image-or-avatar'));
const { centerImagePart  } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'blur',
    aliases: ['gaussian', 'gaussian-blur', 'stackblur'],
    description: 'Draws an image or a user\'s avatar but blurred.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[user/image]',
    run: async (client, message, [ radius, image ], Discord) => {
        if (!radius) return message.reply('Please provide a radius to use this command.');
        if (radius > 180) return message.reply('Please provide a radius below 180.');
        image = image || message.author.displayAvatarURL({ format: 'png', size: 512 });
        if (!validate(image, message)) return message.reply('Please provide a valid image or avatar to use this command.');
        image = await parse(image, message);

        try {
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));
            const { body } = await request.get(image);
            const data = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            const { x, y, width, height } = centerImagePart(data, 440, 440, 15, 20);
            ctx.drawImage(data, x, y, width, height);
            ctx.drawImage(base, 0, 0);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://bob-ross.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: canvas.toBuffer(), name: 'bob-ross.png' }] });
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
