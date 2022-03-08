const { join } = require('path');
const { loadImage, createCanvas } = require('canvas');
const request = require('node-superfetch');
const { validate, parse  } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image.js'));

module.exports = {
    name: 'has-transparency',
    aliases: ['has-alpha', 'transparency', 'transparent', 'alpha'],
    description: 'Determines if an image has transparency in it.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[image]',
    run: async (client, message, [ image ], container) => {   

        if (!validate(image, message)) return message.reply('Please provide an image.');
        image = parse(image, message);

        try {
            const { body } = await request.get(image);
            const data = await loadImage(body);

            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`This image **${hasAlpha(data) ? 'has' : 'does not have'}** transparency.`)
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

function hasAlpha(image) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let hasAlphaPixels = false;
    for (let i = 3; i < data.data.length; i += 4) {
        if (data.data[i] < 255) {
            hasAlphaPixels = true;
            break;
        }
    }
    return hasAlphaPixels;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
