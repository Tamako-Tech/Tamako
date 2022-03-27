const request = require('node-superfetch');


module.exports = {
    name: 'spongebob-time-card',
    aliases: ['time-card', 'sb-time-card', 'spongebob-card', 'sb-card', 'sponge-card', 'sponge-time-card'],
    description: 'Draws police tape over an image or a user\'s avatar.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[text]',
    run: async (client, message, [ ...text], container) => {
        text = text.join(' ');
        if (!text) return message.reply('Please provide text to use this command.');
        if (text.length > 280) return message.reply('Your text is too long. Please use a shorter text.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/spongebobTimeCard`)
                .query({ text: text });

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://spongebob-time-card.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
           
            return message.reply({ embeds: [embed] ,files: [{ attachment: body, name: 'spongebob-time-card.png' }] });
    
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