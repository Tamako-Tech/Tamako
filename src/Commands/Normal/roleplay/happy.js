const fetch = require('node-fetch');

module.exports = {
    name: 'happy',
    aliases: [],
    description: 'happy',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '',
    run: async (client, message, args, Discord) => {
        try {
            const data = await fetch(`${process.env.API_URL}/api/roleplay?type=happy`)
                .then(res => res.json())
                .catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setColor('#d0d0e3')
                .setDescription(`_${message.author} is happy._`)
                .setImage(data.url)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    
            return message.reply({ embeds: [embed] });

        } catch (err) {
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
