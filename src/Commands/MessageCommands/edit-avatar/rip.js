const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

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
    run: async (client, message, [ user, ...cause], container) => {
        cause = cause.join(' ') || ' ';
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} That is not a valid user.`);
        user = parse(user, message);
        if (!cause) return message.reply(`${message.author} You must provide a cause of death.`);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-avatar/rip`)
                .query({ avatarURL: avatarURL, username: user.username, cause: cause });
        
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Rest in Peace! I will miss you')
                .setImage('attachment://rip.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: body, name: 'rip.png' }], embeds: [embed] });
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