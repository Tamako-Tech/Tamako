const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'fist-bump',
    aliases: ['fistbump'],
    description: 'Fist-bumps a user.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {
        
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);
        
        try {
            const data = await request.get(`${process.env.API_URL}/api/roleplay?type=fistbump`);

            const embed = new container.Discord.MessageEmbed()
                .setColor('#8C5192')
                .setDescription(`_${message.author} ${user.id === client.id ? 'Aye Let\'s GOOO' : `fist bumps ${user}`}_`)
                .setImage(data.body.url)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (user.id === message.author.id) return message.reply({embeds: [embed.setDescription(`${message.author} H~here! Thought you needed a fist bump!`)]});
            
            return message.reply({ embeds: [embed] });


        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
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
