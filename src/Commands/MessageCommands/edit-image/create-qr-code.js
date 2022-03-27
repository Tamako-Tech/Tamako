const request = require('node-superfetch');

module.exports = {
    name: 'create-qr-code',
    aliases: ['create-qr'],
    description: 'Draws an image or a user\'s avatar but with contrast.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[image]',
    run: async (client, message, [ ...text ], container) => {
        if (!text) return message.reply('Please provide a text to use this command.');
        text = text.join(' ');
        if (text.length > 500) return message.reply('Text length is too long.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/createqr`)
                .query({ text: text });

            if (Buffer.byteLength(body) > 8e+6) return message.reply('Resulting image was above 8 MB.');

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://qr.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'qr.png' }] });
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