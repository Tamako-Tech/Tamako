const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { shortenText } = require(join(__dirname, '../../../Functions/Utils'));

module.exports = {
    name: 'steam-now-playing-classic',
    aliases: ['now-playing-classic'],
    description: 'Draws a user\'s avatar over a Steam "now playing" notification (old skin).',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[game] [user]',
    run: async (client, message, [ game, user ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} | Please provide a valid user.`);
        user = parse(user);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 64 });
        try {
            const base = await loadImage(join(__dirname, '../../../assets/images/steam-now-playing-classic.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(avatar, 21, 21, 32, 32);
            ctx.fillStyle = '#90ba3c';
            ctx.font = '10px Noto Regular';
            ctx.fillText(user.username, 63, 26);
            ctx.fillText(shortenText(ctx, game, 160), 63, 54);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Steam is nice but Epic Games is good as well')
                .setImage('attachment://steam-now-playing-classic.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'steam-now-playing-classic.png' }], embeds: [embed] });
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
