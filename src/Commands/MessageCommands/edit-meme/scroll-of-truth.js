const request = require('node-superfetch');

module.exports = {
    name: 'scroll-of-truth',
    aliases: ['truth', 'scroll', 'truth-scroll', 'scroll-truth'],
    description: 'Sends a "Scroll of Truth" meme with the text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[text]',
    run: async (client, message, [ ...text ], container) => {
        text = text.join(' ');
        if (!text) return message.reply('What do you want the scroll of truth to say?');
        if (text.length > 500) return message.reply('Your message is too long. Please provide a message with less than 500 characters.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/scroll-of-truth`)
                .query({ text: text });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://scroll-of-truth.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'scroll-of-truth.png' }] });
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