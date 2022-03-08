module.exports = async function (client, message, command, Discord) {
    if (!command.onlyGuilds) return false;
    if (command.onlyGuilds.some(id => id == message.guild.id)) return false;
    else {
        let onlyGuilds = [];
        command.onlyGuilds.forEach(id => {
            onlyGuilds.push(client.guilds.cache.get(id).name);
        });
        if (command.returnOnlyGuilds == false || command.returnNoErrors) return true;
        else message.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({
                    name: message.member.user.tag,
                    iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('RED')
                .setTimestamp()
                .setDescription(`This command can only be ran in these guilds.\n•${onlyGuilds.join('\n•')}`)
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