const request = require('node-superfetch');

module.exports = {
    name: 'pogchamp',
    aliases: ['pog'],
    description: 'Sends a pogchamp duplicated however many times you want.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[amount]',
    run: async (client, message, [ amount ], container) => {
        if (isNaN(amount)) return message.reply('Please provide a valid number.');
        if (amount < 1) return message.reply('Please provide a number greater than 0.');
        if (amount > 100) return message.reply('Please provide a number less than 100.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/pogchamp`)
                .query({ amount: amount });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://pogchamp.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'pogchamp.png' }] });
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