const request = require('node-superfetch');

module.exports = {
    name: 'gender',
    aliases: ['guess-gender', 'gender-guess'],
    description: 'Determines the gender of a name.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[month]',
    run: async (client, message, [ name ], Discord) => {   

        if (!name) return message.reply('Please provide a name.');
        name = name.join(' ');
        if (!name.length > 20 ) return message.reply('Please provide a name with less than 20 characters.');
        try {
            const { body } = await request
                .get('https://api.genderize.io/')
                .query({ name });
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`I have no idea what gender ${body.name} is.`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            if (!body.gender) return message.reply({ embeds: [embed] });

            return message.reply({ embeds: [embed.setDescription(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`)] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
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
