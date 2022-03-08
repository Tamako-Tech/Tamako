const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'sip',
    aliases: ['tea'],
    description: 'Draws a user\'s avatar sipping tea.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user] [direction:left/right]',
    run: async (client, message, [ user, direction = 'left'], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} That is not a valid user.`);
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-avatar/sip`)
                .query({ avatarURL: avatarURL, direction: direction });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Tea!')
                .setImage('attachment://sip.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: body, name: 'sip.png' }], embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.container.Discord.MessageEmbed()
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