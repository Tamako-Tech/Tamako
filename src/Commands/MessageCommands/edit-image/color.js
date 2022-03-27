const request = require('node-superfetch');

module.exports = {
    name: 'color',
    aliases: ['colour'],
    description: 'Sends an image of the color you choose.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[color]',
    run: async (client, message, [ color ], container) => {
        if (!color) return message.reply('What color do you want to view? This can be #colorcode or a name.');
        color = color.toLowerCase();
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/color`)
                .query({ color: color });
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://color.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'color.png'}] });
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