const { join } = require('path');
const config = require(join(__dirname, '..', '..', 'Config.js'));
module.exports = async function (message, command, Discord) {
    if (!command.ownerOnly) return false;
    if (config.developers.some(id => message.member.user.id == id)) return false;
    else {
        if (command.returnOwnerOnly == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('RED')
                .setTimestamp()
                .setDescription('This command is reserved for the developers of the bot.')
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
