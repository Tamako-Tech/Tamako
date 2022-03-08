const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { list } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const hats = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'hat.json'));

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
    run: async (client, message, [ type, user, addX = 0, addY = 0, scale = 0 ], container) => {
        user = user || message.author.id;
        if (!(validate(user, message))) return message.reply('Please provide a valid user.');
        if (!type) {
            return message.reply('Please specify a hat type.' + `${list(hats, 'or')}`);
        }
        if (!hats.includes(type)) return message.reply(`Please specify a valid hat type. ${list(hats, 'or')}`);
        user = parse(user, message);
        scale /= 100;
        if (scale === 0) scale = 0;
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-avatar/hat`)
                .query({ avatarURL: avatarURL, type: type, addX: addX, addY: addY, scale: scale });
                            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('You Like Hats?')
                .setImage(`attachment://${type}-hat.png`)
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: body, name: `${type}-hat.png` }], embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
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