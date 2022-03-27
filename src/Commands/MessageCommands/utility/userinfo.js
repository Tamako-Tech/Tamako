const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { timeZoneConvert } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
module.exports = {
    name: 'userinfo',
    aliases: ['whois'],
    description: 'Fetch User Information',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Utility',
    usage: '',
    run: async (client, message, [ user ], container) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user, who is in this server');
        user = parse(user, message);
        
        try {
            const embed = new container.Discord.MessageEmbed()
                .setColor(user && user.displayColor ? user.displayColor : '#7289DA')
                .setAuthor(`Discord user ${user.username}`)
                .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(`${user.tag} (${user.id})`)
                .addField('Account created', timeZoneConvert(user.createdAt), true)
                .addField('Joined this server', timeZoneConvert(user.joinedAt), true)
                .setFooter({ text: `Userinfo  | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                
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