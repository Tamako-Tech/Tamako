const request = require('node-superfetch');

module.exports = {
    name: 'achievement',
    aliases: ['minecraft-achievement'],
    description: 'Sends a text box from Ace Attorney with the quote and character of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[Achievement Name]',
    run: async (client, message, [ ...text ], container) => {
        text = text.join(' ');
        if (text.length > 50) return message.reply('Please keep the text below or exactly 50 characters.');
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/achievement/${text}`);
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('ooo a New Achievement')
                .setImage('attachment://achievement.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'achievement.png' }] });
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