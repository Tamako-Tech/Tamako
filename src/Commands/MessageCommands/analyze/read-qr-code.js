const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse  } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image.js'));
const { shorten  } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'read-qr-code',
    aliases: ['scan-qr-code', 'scan-qr', 'read-qr'],
    description: 'Reads a QR Code.',
    ownerOnly: false,
    cooldown: 6000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[image]',
    run: async (client, message, [ image ], container) => {   

        if (!validate(image, message)) return message.reply('Please provide an image.');
        image = parse(image, message);
        if (!image) return message.reply('Please provide an image.');
        try {
            const { body } = await request
                .get('https://api.qrserver.com/v1/read-qr-code/')
                .query({ fileurl: image });
            const data = body[0].symbol[0];
            if (!data.data) return message.reply(`Could not read QR Code: ${data.error}.`);

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`QR: ${shorten(data.data, 2000 - (message.author.toString().length + 2))}`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });

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
