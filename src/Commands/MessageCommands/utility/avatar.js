const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'avatar',
    aliases: [],
    description: 'Get avatar of a user',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Utility',
    usage: '[user]',
    run: async (client, message, [user], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} That is not a valid user.`);
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });

        try {
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`${user.username}'s avatar`)
                .setImage(avatarURL)
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        } catch {
            return message.reply('Failed to send DM. You probably have DMs disabled.');
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