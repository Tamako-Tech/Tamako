const { join } = require('path');
const fetch = require('node-fetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'baka',
    aliases: [],
    description: 'It\'s not like I want you to use my command.. ~Baka!',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], Discord) => {
        try {
            const data = await fetch(`${process.env.API_URL}/api/roleplay?type=kiss`)
                .then(res => res.json())
                .catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage(data.url)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            if (!user) return message.reply({ embeds: [embed] });
            if (!validate(user, message)) return message.reply('Please provide a valid user.');
            user = parse(user, message);
            
            if (user.id === client.user.id) return message.react('💢');
            if (user.id === message.author.id) return message.reply(`\\❌ No **${message.author.tag}**, you're not Baka!`);

            return message.reply({ embeds: [ embed.setDescription(`${user} B~baka!`) ] });

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
