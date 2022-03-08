module.exports = async function (message, command, Discord) {
    if (!command.requiredRoles) return false;
    let missing = [];
    command.requiredRoles.forEach(role => {
        if (!message.member.roles.cache.has(role)) missing.push(`<@&${role}>`);
    });
    if (missing.length == 0) return false;
    else {
        if (command.returnRequiredRoles == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('RED')
                .setTimestamp()
                .setDescription(`You are required to have these roles to be able to run this command.\n•${missing.join('\n•')}`)
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
