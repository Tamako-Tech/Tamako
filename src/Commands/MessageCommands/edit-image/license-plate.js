const request = require('node-superfetch');

module.exports = {
    name: 'license-plate',
    aliases: [],
    description: 'Creates a license plate with the text of your choice.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[text]',
    run: async (client, message, [...text], container) => {
        text = text.join('');
        if (text.length > 10 || text.lenth <= 0) return message.reply('What text should the license plate say? (should be less than 10 characters)');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/licensePlate`)
                .query({ text: text });

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://license-plate.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] ,files: [{ attachment: body, name: 'license-plate.png' }] });
    
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