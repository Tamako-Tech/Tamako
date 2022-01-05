const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));

module.exports = {
    name: 'hold-hands',
    aliases: ['hold-hand', 'holdhands', 'holdhand'],
    description: 'Hold Hands of a user',
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
            const embed = new Discord.MessageEmbed()
                .setColor('#D4D977')
                .setDescription(`_${message.author} is disgusted${message.author.id !== user.id ? ` by ${user}` : '...'}._`)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (user.id === client.user.id) {
                const data = await request.get(`${process.env.API_URL}/api/roleplay?type=blush`);

                return message.reply({ embeds: [
                    embed
                        .setColor('#FFB6C1')
                        .setImage(data.body.url)
                        .setDescription(`_${message.author} holds my hands~_ E~Echi~`)]
                });
            }
            
            const data = await request.get(`${process.env.API_URL}/api/roleplay?type=holdhands`);
          
            return message.reply({ embeds: [embed.setImage(data.body.url)] });

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
