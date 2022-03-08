module.exports = async function (message, command, Discord) {
    if (!command.anyUserPermission) return false;
    if (command.anyUserPermission.some(i => message.member.permissions.has(i))) return false;
    else {
        if (command.returnAnyUserPermissions == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('RED')
                .setTimestamp()
                .setDescription(`You require any one of these permissions to be able to run this command..\n•${command.anyUserPermission.join('\n•')}`)
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