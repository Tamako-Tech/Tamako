const { join } = require('path');
const { validate } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'unmute',
    aliases: [],
    description: 'Unmutes a user in the server.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MODERATE_MEMBERS'],
    clientPermissions: ['SEND_MESSAGES', 'MODERATE_MEMBERS'],
    category: 'Moderation',
    usage: '<user> [time] [reason]',
    run: async (client, message, [ member = '', time, ...reason ], container) => {
        if (!member || !validate(member, message)) return message.reply(`${message.author} | Please provide a valid user.`);
        if (!time) return message.reply(`<:cancel:788323084770738216> | ${message.author}, Please provide the time to mute the user. [mention first before adding the reason]`);
        reason = reason.join(' ') || 'UnSpecified';
        try {
            member = await message.guild.members
                .fetch(member.match(/\d{17,19}/)[0])
                .catch(() => null);
          
            return member.timeout(null, reason) 
                .then(_member => message.reply(`Successfully unmuted **${_member.user.tag}**.`))
                .catch(() => message.reply(`Failed to unmute **${member.user.tag}**!`));

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
