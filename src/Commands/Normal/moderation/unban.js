module.exports = {
    name: 'unban',
    aliases: [],
    description: 'Unban a user from the server.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    category: 'Moderation',
    usage: '<user> [reason]',
    run: async (client, message, [ user = '', ...reason ], Discord) => {
        if (!user.match(/\d{17,19}/)){
            return message.reply(`<:cancel:788323084770738216> | ${message.author}, Please provide the ID of the user to unban`);
        }
        try {
            user = user.match(/\d{17,19}/)[0];

            return message.guild.members.unban(user, { reason: `TAMAKO Unbans: ${message.author.tag}: ${reason.join(' ') || 'None'}`})
                .then(user => message.reply(`\\✔️ Successfully unbanned **${user.tag}**!`))
                .catch(() => message.reply(`\\❌ Unable to unban user with ID ${user}. The provided argument maybe not a valid user id, or the user is not banned.`));
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
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
