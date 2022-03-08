const request = require('node-superfetch');
const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image-or-avatar'));

module.exports = {
    name: 'metamorphosis',
    aliases: ['my-metamorphosis-begins', 'morph'],
    description: 'Sends a "My Metamorphosis Begins" meme with the image and text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[image] [name]',
    run: async (client, message, [ image, ...name ], container) => {
        if (message.attachments.first()) {
            name = image;
            image = message.attachments.first();
        }
        if (!name) return message.reply('Please provide a name to use this command.');
        if (name.length > 20) return message.reply('Please provide a name to use this command that is less than 20 characters.');
        image = image || message.attachments.first() || message.author.displayAvatarURL({ format: 'png', size: 512 });
        if (!image) return message.reply('Please provide an image or avatar to use this command.');
        if (!validate(image, message)) return message.reply('Please provide an image or avatar to use this command.');
        image = await parse(image, message);

        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/metamorphosis`)
                .query({ name: name, image: image });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://metamorphosis.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'metamorphosis.png' }] });
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