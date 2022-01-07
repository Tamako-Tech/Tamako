const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { drawImageWithTint } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'he-lives-in-you',
    aliases: ['mufasa', 'simba'],
    description: 'Draws a user\'s avatar over Simba from The Lion King\'s reflection.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user]',
    run: async (client, message, [ user ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const base = await loadImage(join(__dirname, '../../../assets/images/he-lives-in-you.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.rotate(-24 * (Math.PI / 180));
            drawImageWithTint(ctx, avatar, '#00115d', 75, 160, 130, 150);
            ctx.rotate(24 * (Math.PI / 180));
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('He Lives in You')
                .setImage('attachment://he-lives-in-you.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'he-lives-in-you.png' }], embeds: [embed] });
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
