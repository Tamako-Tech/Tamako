const request = require('node-superfetch');

module.exports = {
    name: 'boardroom-meeting',
    aliases: ['boardroom-suggestion', 'boardroom'],
    description: 'Sends a "Boardroom Meeting" meme with the text of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[user]',
    run: async (client, message, [ question, suggestion1, suggestion2, final ], container) => {
        if (!question) return message.reply('Please provide a question.');
        if (!suggestion1) return message.reply('What should the first employee suggest?');
        if (!suggestion2) return message.reply('What should the second employee suggest?');
        if (!final) return message.reply('What should the employee who gets thrown out the window suggest?');
        if (question.length > 100 || suggestion1.length > 50 || suggestion2.length > 50 || final.length > 50) return message.reply('Please make sure your question should be under 100 characters , suggestions are under 50 characters.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/boardroomMeeting`)
                .query({ question: question, suggestion1: suggestion1, suggestion2: suggestion2, final: final });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://boardroomMeeting.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'boardroomMeeting.png' }] });
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