const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'hearts',
    aliases: ['heart'],
    description: 'Draws hearts around a user\'s avatar.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user]',
    run : async(client, message, [ user ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} | Please provide a valid user.`);
        user = parse(user);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(join(__dirname, '../../../assets/images/i-have-the-power.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.rotate(18.3 * (Math.PI / 180));
            ctx.drawImage(avatar, 332, -125, 175, 175);
            ctx.rotate(-18.3 * (Math.PI / 180));
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('You Have The Power')
                .setImage('attachment://i-have-the-power.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'i-have-the-power.png' }], embeds: [embed] });
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
