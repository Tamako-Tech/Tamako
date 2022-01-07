const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { list } = require(join(__dirname, '../../../Functions/Utils'));
const hats = require(join(__dirname, '../../../assets/json/hat'));

module.exports = {
    name: 'hat',
    aliases: [ ],
    description: 'Draws a hat over a user\'s avatar.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[type of hat] [user] [addX] [addY] [scale]',
    run: async (client, message, [ type, user, addX = 0, addY = 0, scale = 0 ], Discord) => {
        user = user || message.author.id;
        if (!(validate(user, message))) return message.reply('Please provide a valid user.');
        if (!type) {
            return message.reply('Please specify a hat type.' + `${list(hats, 'or')}`);
        }
        user = parse(user, message);
        scale /= 100;
        if (scale === 0) scale = 1;
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const base = await loadImage(join(__dirname, '../', '../', '../', 'assets', 'images', 'hat', `${type}.png`));
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const canvas = createCanvas(avatar.width, avatar.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(avatar, 0, 0);
            ctx.drawImage(base, 0 + addX, 0 + addY, avatar.width * scale, avatar.height * scale);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('You Like Hats?')
                .setImage(`attachment://${type}-hat.png`)
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: `${type}-hat.png` }], embeds: [embed] });
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
