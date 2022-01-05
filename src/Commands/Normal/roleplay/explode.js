const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'explode',
    aliases: ['explosion', 'boom', 'boom-boom', 'xplode'],
    description: 'Explode a user.',
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
            if (user.id === client.user.id) return message.reply('Baka! You cannot explode me.');

            const data = await request.get(`${process.env.API_URL}/api/roleplay?type=explode`);

            const embed = new Discord.MessageEmbed()
                .setColor('#8B1E1E')
                .setDescription(`_${message.author} ${message.author.id !== user.id ? ` exploded ${user}` : ' casts explosion'}._`)
                .setImage(data.body.url)
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
