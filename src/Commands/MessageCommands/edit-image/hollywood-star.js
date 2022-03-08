const request = require('node-superfetch');

module.exports = {
    name: 'hollywood-star',
    aliases: ['hollywood', 'walk-of-fame', 'walk-of-fame-star'],
    description: 'Sends a Hollywood Walk of Fame star with the name of your choice.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[name]',
    run: async (client, message, [name], container) => {
        if (!name) return message.reply('Please provide a name to use this command.');

        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/hollywoodstar`)
                .query({ name: name });
        
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://hollywood-star.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] ,files: [{ attachment: body, name: 'hollywood-star.png' }] });
    
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