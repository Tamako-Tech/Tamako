const { join } = require('path');
const { validate } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'ban',
    aliases: [],
    description: 'Ban a user from the server.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    category: 'Moderation',
    usage: '[member] [reason]',
    run: async (client, message, [ member, ...reason], Discord) => {
        if (!member || !validate(member, message)) return message.reply(`${message.author} | Please provide a valid user.`);
        
        try {          
            member = await message.guild.members
                .fetch(member.match(/\d{17,19}/)[0])
                .catch(() => null);
      
            if (!member) return message.reply(`<:cancel:788323084770738216> | ${message.author}, User could not be found! Please ensure the supplied ID is valid. Mention user for more precision on pinpointing user.`);
            if (member.id === message.author.id) return message.reply(`<:cancel:788323084770738216> | ${message.author}, You cannot ban yourself!`);
            if (member.id === client.user.id) return message.reply(`<:cancel:788323084770738216> | ${message.author}, Please don't ban me!`);
            if (member.id === message.guild.ownerID) return message.reply(`<:cancel:788323084770738216> | ${message.author}, You cannot ban a server owner!`);          
            if (message.member.roles.highest.position < member.roles.highest.position) return message.reply(`<:cancel:788323084770738216> | ${message.author}, You can't ban that user! He/She has a higher role than yours`);
            if (!member.bannable) return message.reply(`<:cancel:788323084770738216> | ${message.author}, I couldn't ban that user!`);

            await message.reply(`Are you sure you want to ban **${member.user.tag}**? (y/n)`);
          
            const msg_filter = (m) => m.author.id === message.author.id;
            const proceed = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: 30000, errors: ['time'] })
                .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
                .catch(() => false);
                
            if (!proceed) return message.reply(`<:cancel:788323084770738216> | ${message.author}, cancelled the ban command!`);
          
            await member.send(`**${message.author.tag}** banned you from ${message.guild.name}!\n**Reason**: ${reason.join(' ') || 'Unspecified.'}`)
                .catch(() => null);
          
            return member.ban({ reason: `Tamako Ban Command: ${message.author.tag}: ${reason.join(' ') || 'Unspecified'}`})
                .then(_member => message.reply(`Successfully banned **${_member.user.tag}**`))
                .catch(() => message.reply(`Failed to ban **${member.user.tag}**!`));
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
