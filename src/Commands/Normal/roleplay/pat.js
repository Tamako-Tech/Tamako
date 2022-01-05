const { join } = require('path');
const fetch = require('node-fetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'pat',
    aliases: ['headpat'],
    description: 'Pat someone',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], Discord) => {

        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        
        try {
            
            const data = await fetch(`${process.env.API_URL}/api/roleplay?type=pat`)
                .then(res => res.json())
                .catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setColor('#EF9349')
                .setDescription(`_${ user.id === message.author.id  ? `Here you go ${message.author}, *pat* *pat*` :  `${message.member} pats ${user}!`}._`)
                .setImage(data.url)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (user.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`${message.author}, UwU <3! Thanks!`)] });

            return message.reply({ embeds: [embed] });


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
