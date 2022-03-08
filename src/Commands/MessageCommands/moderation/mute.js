const { join } = require('path');
const ms = require('ms');
const { validate } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'mute',
    aliases: ['timeout'],
    description: 'Mutes a user in the server.',
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
        time = ms(`${time}`);
        try {
            member = await message.guild.members
                .fetch(member.match(/\d{17,19}/)[0])
                .catch(() => null);
          
            return member.timeout(time, reason) 
                .then(_member => message.reply(`Successfully Muted **${_member.user.tag}** for ${ms(time, { long: true })}.`))
                .catch(() => message.reply(`Failed to mute **${member.user.tag}**!`));

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
