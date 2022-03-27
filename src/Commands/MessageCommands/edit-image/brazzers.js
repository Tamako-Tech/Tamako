const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image-or-avatar'));

module.exports = {
    name: 'brazzers',
    aliases: [],
    description: 'Draws an image with the Brazzers logo in the corner.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[user/image]',
    run: async (client, message, [ image ], container) => {
        if (!message.channel.nsfw) return message.reply('Please use this in an nsfw channel');
        image = image || message.attachments.first() || message.author.displayAvatarURL({ format: 'png', size: 512 });
        if (!validate(image, message)) return message.reply('Please provide a valid image or avatar to use this command.');
        image = await parse(image, message);

        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/brazzers`)
                .query({ image: image });
            

            if (Buffer.byteLength(body) > 8e+6) return message.reply('Resulting image was above 8 MB.');
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://brazzers.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'brazzers.png' }] });
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