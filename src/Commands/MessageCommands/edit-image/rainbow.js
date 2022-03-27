const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image-or-avatar'));

module.exports = {
    name: 'rainbow',
    aliases: ['gay'],
    description: 'Draws a rainbow over an image or a user\'s avatar.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[image/user]',
    run: async (client, message, [image], container) => {
        image = image || message.attachments.first() || message.author.displayAvatarURL({ format: 'png', size: 512 });
        if (!validate(image, message)) return message.reply('Please provide an image or avatar to use this command.');
        image = await parse(image, message);
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/rainbow`)
                .query({ image: image });
        
            if (Buffer.byteLength(body) > 8e+6) return message.reply('Resulting image was above 8 MB.');

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://rainbow.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] ,files: [{ attachment: body, name: 'rainbow.png' }] });
    
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