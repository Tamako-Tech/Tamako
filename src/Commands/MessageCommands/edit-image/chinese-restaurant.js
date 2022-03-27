const request = require('node-superfetch');

module.exports = {
    name: 'chinese-restaurant',
    aliases: ['chinese-restaurant-sign', 'chinese-food-sign', 'chinese-sign'],
    description: 'Sends a Chinese restaurant sign with the text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[text]',
    run: async (client, message, [ ...text ], container) => {
        text = text.join(' ');
        if (!text) return message.reply('Please provide a text to use this command.');
        try {
                       
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/chineserestaurant`)
                .query({ text: text });

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://chinese-restaurant.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'chinese-restaurant.png' }] });
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