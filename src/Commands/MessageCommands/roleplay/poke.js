const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'poke',
    aliases: [],
    description: 'Poke Your Friends',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {

        if (!user) return message.reply(`\\❌ **${message.author.tag}**, who am I supposed to poke?`);
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        
        try {
            if (user.id === message.author.id) return message.reply(`\\❌ No ${message.author} You cannot poke yourself!`);
            
            const data = await request.get(`${process.env.API_URL}/api/roleplay/poke`);

            const embed = new container.Discord.MessageEmbed()
                .setColor('#FF5A51')
                .setDescription(`_${ user.id === client.user.id  ? 'I\'m already here! Need something?' :  `${message.member} pokes ${user}!`}._`)
                .setImage(data.body.url)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (user.id === client.user.id) return message.reply({ embeds: [embed] });

            return message.reply({ embeds: [embed] });


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
