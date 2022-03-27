const { join } = require('path');
const { safe, nsfw } = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'tamako.json'));
module.exports = {
    name: 'bestgirl',
    aliases: ['kitashirakawa'],
    description: 'Tamako is the best girl and there\'s no denying it! but you should also check out Mai',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Core',
    usage: '',
    run: async (client, message, args, container) => {   
        
        try {
            if (message.channel.nsfw) return message.channel.send({ embeds: [new container.Discord.MessageEmbed().setColor('RED').setImage(nsfw[Math.ceil(Math.random() * (nsfw.length))])]});

            return message.channel.send( { embeds: [new container.Discord.MessageEmbed().setColor('GREY').setImage(safe[Math.ceil(Math.random() * (safe.length))])]});
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
