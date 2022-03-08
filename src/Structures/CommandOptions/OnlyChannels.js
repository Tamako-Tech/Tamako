module.exports = async function (message, command, Discord) {
    if (!command.onlyChannels) return false;
    if (command.onlyChannels.some(id => id == message.channel.id)) return false;
    else {
        let onlyChannels = [];
        command.onlyChannels.forEach(id => {
            onlyChannels.push(`<#${id}>`);
        });
        if (command.returnOnlyChannels == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('RED')
                .setTimestamp()
                .setDescription(`This command can only be ran in these channels.\n•${onlyChannels.join('\n•')}`)
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