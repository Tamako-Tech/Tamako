module.exports = {
    name: 'hackban',
    aliases: [],
    description: 'Hackban a user from the server.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    category: 'Moderation',
    usage: '<user> [reason]',
    run: async (client, message, [ mention, ...reason ], container) => {
    
        try {
            if (!mention || !mention.match(/\d{17,19}/))
                return message.reply(`<:cancel:712586986216489011> | ${message.author}, Please supply the ID of the user to ban.`);
  
            let user = await client.users.fetch(mention.match(/\d{17,19}/)[0]).catch(()=>null);
  
            if (!user)
                return message.reply(`<:cancel:712586986216489011> | ${message.author}, Invalid user ID. Please supply a valid container.Discord User ID.`);
  
            if (user.id === message.author.id)
                return message.reply(`<:cancel:712586986216489011> | ${message.author}, You cannot ban yourself!`);
  
            if (user.id === client.user.id)
                return message.reply(`<:cancel:712586986216489011> | ${message.author}, Please don't ban me!`);
  
            if (user.id === message.guild.ownerID)
                return message.reply(`<:cancel:712586986216489011> | ${message.author}, You cannot ban a server owner!`);
  
  
            reason = reason.length ? reason.join(' ') : 'None';
  
            message.guild.members.ban(user, { reason:  `TAMAKO HACK BAN: ${message.author.tag}: ${reason}` })
                .then(()=> message.reply(`Successfully hackbanned **${user.tag}**! (${user.id})${user.bot ? ' **(BOT)**':''}`))
                .catch(()=> message.reply(`<:cancel:712586986216489011> | ${message.author}, Unable to hackban **${user.tag}**! (${user.id})`));
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
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
