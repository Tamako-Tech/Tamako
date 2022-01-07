const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'chocolate-milk',
    aliases: ['sip-milk', 'sip-chocolate-milk', 'sip-choccy'],
    description: 'Draws a user\'s avatar holding chocolate milk.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user] [direction: left/right]',
    run: async (client, message, [ user, direction = 'left'], Discord) => {   
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        if(!direction || !direction === 'left' || !direction === 'right') {
            return message.reply('Please specify a direction (left or right)');
        }
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(join(__dirname, '../../../assets/images/chocolate-milk.png'));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillRect(0, 0, base.width, base.height);
            if (direction === 'right') {
                ctx.translate(base.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(avatar, 0, 0, 512, 512);
            if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(base, 0, 0);
            

            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Chocolate Milk')
                .setImage('attachment://chocolate-milk.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'chocolate-milk.png' }], embeds: [embed] });
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
