const request = require('node-superfetch');
module.exports = {
    name: 'axis-cult-sign-up',
    aliases: ['axis-sign-up'],
    description: 'Sends an Axis Cult Sign-Up sheet for you.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[gender] [age] [profession]',
    run: async (client, message, [ gender, age, ...profession ], container) => {
        gender = gender.toLowerCase();
        profession = profession.join(' ');
        // not working 
        // having issues here
        if (!(gender === 'male' || gender === 'female')) return message.reply('Enter a gender: Male or Female'); 
        if (age < 1 || age > 1000) return message.reply('Invalid age');
        if (profession.length > 15) return message.reply('Enter a profession less than 15 characters');
        try {

            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-image/axis-cult`)
                .query({ username: message.author.username, gender: gender, age: age, profession: profession });

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://axis-cult-sign-up.jpg')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'axis-cult-sign-up.jpg' }] });
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