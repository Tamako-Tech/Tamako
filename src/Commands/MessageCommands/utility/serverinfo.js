const {join} = require('path');
const { timeZoneConvert } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
module.exports = {
    name: 'serverinfo',
    aliases: [ 'guild', 'server', 'serverstat', 'serverstats', 'guildstat', 'guildstats' ],
    description: 'Fetch Server Information',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Utility',
    usage: '',
    run: async (client, message, args, container) => {
    
        
        try {
            const owner = await client.users.fetch(message.guild.ownerId);
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREEN')
                .setAuthor({name: message.guild.name})
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription(`${message.guild.name} (${message.guild.id})`)
                .addField('Created', `${timeZoneConvert(message.guild.createdAt)}`, true)
                .addField('Owner', `${owner.tag} (${owner.id})`, true)
                .addField('Members', `${message.guild.memberCount}`, true)
                .addField('Channels', `${message.guild.channels.cache.size}`, true) 
                .addField('Roles', `${message.guild.roles.cache.size}`, true) 
                .addField('Emojis', `${message.guild.emojis.cache.size}`, true) 
                .addField('Verification Level', message.guild.verificationLevel, true)
                .addField('Boost Tier', message.guild.premiumTier, true)
                .addField('Boosts', `${message.guild.premiumSubscriptionCount}`, true) // not work
                .addField('Boosts Until', timeZoneConvert(message.guild.premiumSubscriptionCount), true)
                .setFooter({ text: `Serverinfo  | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });

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