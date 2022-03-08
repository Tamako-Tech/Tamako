const request = require('node-superfetch');
const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image-or-avatar'));

module.exports = {
    name: 'eyes',
    aliases: [],
    description: 'Draws emoji eyes onto the faces in an image.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[image/user]',
    run: async (client, message, [ image ], container) => {
        image = image || message.attachments.first();
        if (!image) return message.reply('Please provide a face to scan.');
        if (!validate(image, message)) return message.reply('Please provide an image or avatar to use this command.');
        image = await parse(image, message);
        try {
            const { body }  = await request
                .get(`${process.env.API_URL}/canvas/edit-image/eyes`)
                .query({ image: image })
                .catch(err => {
                    return message.reply(err.text);
                });
            if (body){
                return message.reply({ files: [{ attachment: body, name: 'eyes.png' }] });
            }
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