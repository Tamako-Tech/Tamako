const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { greyscale } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'rip',
    aliases: ['grave', 'grave-stone'],
    description: 'Draws a user\'s avatar over a grave stone.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user] [cause of death]',
    run: async (client, message, [ user, cause = ''], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} | Please provide a valid user.`);
        user = parse(user);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const base = await loadImage(join(__dirname, '../../../assets/images/rip.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.drawImage(avatar, 194, 399, 500, 500);
            greyscale(ctx, 194, 399, 500, 500);
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.font = '62px CoffinStone';
            ctx.fillStyle = 'black';
            ctx.fillText(user.username, 438, 330, 500);
            ctx.fillStyle = 'white';
            if (cause) ctx.fillText(cause, 438, 910, 500);
            ctx.font = '37px CoffinStone';
            ctx.fillText('In Loving Memory of', 438, 292);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Rest in Peace! I will miss you')
                .setImage('attachment://rip.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }], embeds: [embed] });
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
