const request = require('node-superfetch');

module.exports = {
    name: 'gandhi-quote',
    aliases: ['gandhi', 'mahatma-gandhi', 'mahatma-gandhi-quote'],
    description: 'Makes Mahatma Gandhi say the quote you want.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[quote]',
    run: async (client, message, [...quote], container) => {
        if (!quote.length) return message.reply('Please provide a quote to use this command.');
        quote = quote.join(' ');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/gandhiquote`)
                .query({ quote: quote  });

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://gandhi.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] ,files: [{ attachment: body, name: 'gandhi.png' }] });
    
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