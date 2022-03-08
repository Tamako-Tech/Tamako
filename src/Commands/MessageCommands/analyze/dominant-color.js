const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const { rgbToHex } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image.js'));

module.exports = {
    name: 'dominant-color',
    aliases: ['dom-color', 'dominant-colour'],
    description: 'Determines the dominant color of an image.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[image]',
    run: async (client, message, [ image ], container) => {   

        if (!validate(image, message)) return message.reply('Please provide an image.');
        const url = parse(image, message);
        try {
            const data = await loadImage(url);
            const canvas = createCanvas(250, 250);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0, 1, 1);
            const imgData = ctx.getImageData(0, 0, 1, 1).data;
            const hexColor = `#${rgbToHex(imgData[0], imgData[1], imgData[2]).padStart(6, '0')}`;
            ctx.fillStyle = hexColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`The Dominant Color of the Image Is: ${hexColor}`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://container.Discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
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
