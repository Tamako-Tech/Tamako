const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'axis-cult-sign-up',
    aliases: ['axis-sign-up'],
    description: 'Sends an Axis Cult Sign-Up sheet for you.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[gender] [age] [profession]',
    run: async (client, message, [ gender, age, profession ], Discord) => {
        if (gender != 'male' || gender != 'female') return message.reply('Enter a gender: Male or Female');
        if (age < 1 || age > 1000) return message.reply('Invalid age');
        if (profession.length > 15) return message.reply('Enter a profession less than 15 characters');
        try {
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'axis-cult-sign-up.jpg'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '96 Konosuba';
            ctx.fillText(message.author.username, 960, 1558);
            ctx.fillText(gender, 960, 1752);
            ctx.fillText(age, 1700, 1752);
            ctx.fillText('XXX-XXX-XXXX', 960, 1960);
            ctx.fillText(profession, 960, 2169);
            ctx.fillText('Tamako', 960, 2370);
            ctx.font = '123px Konosuba';
            ctx.fillText('ERIS PADS\nHER CHEST!', 1037, 2874);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://axis-cult-sign-up.jpg')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: canvas.toBuffer('image/jpeg'), name: 'axis-cult-sign-up.jpg' }] });
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
