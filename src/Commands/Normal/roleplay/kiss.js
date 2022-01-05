const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'kiss',
    aliases: [],
    description: 'Show your love to someone special! Not me lol',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], Discord) => {
        
        if (!user) return message.reply(`${message.author} you desperate enough to kiss an invisible user?!`);
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);

        try {
            if (user.id === message.author.id) return message.reply(`${message.author}, ever heard of a mirror?`);

            const data = await request.get(`${process.env.API_URL}/api/roleplay?type=kiss`);
                
            const embed = new Discord.MessageEmbed()
                .setColor('#FFB6C1')
                .setImage(data.body.url)
                .setDescription(`_${message.author} ${user.id !== client.user.id  ? `just kissed ${user}!` : 'E~echhi!'}_`)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

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
