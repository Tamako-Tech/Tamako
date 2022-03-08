const request = require('node-superfetch');

module.exports = {
    name: 'genie-rules',
    aliases: ['genie', '4-rules', 'four-rules', 'there-are-four-rules', 'there-are-4-rules'],
    description: 'Sends a "There are 4 rules" meme with the text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[Wish]',
    run: async (client, message, [ ...text ], container) => {
        text = text.join(' ');
        if (!text) return message.reply('What do you want to wish for?');
        if (text.length > 500) return message.reply('Your message is too long. Please provide a message with less than 500 characters.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/genie-rules`)
                .query({ text: text });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://genie-rules.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'genie-rules.png' }] });
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