module.exports = async function (message, command, Discord) {
    if (!command.anyClientPermission) return false;
    if (command.anyClientPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyClientPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({
                        name: message.member.user.tag,
                        iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                    })
                    .setColor('Red')
                    .setTimestamp()
                    .setDescription(`I required any one of these permissions for this command.\n•${command.anyClientPermission.join('\n•')}`)
                    .setFooter({ text: `Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako` })],
            allowedMentions: {
                repliedUser: false
            }
        });
        return true;
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */