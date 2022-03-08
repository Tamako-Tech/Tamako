const { join } = require('path');
const { createWorker } = require('tesseract.js');
const { validate, parse  } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image.js'));

module.exports = {
    name: 'ocr',
    aliases: ['tesseract', 'optical-character-recognition'],
    description: 'Performs Optical Character Recognition on an image.',
    ownerOnly: false,
    cooldown: 10000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[image]',
    run: async (client, message, [ image ], container) => {   

        if (!validate(image, message)) return message.reply('Please provide an image.');
        image = parse(image, message);
        try {
            if (image.toLowerCase().endsWith('.gif')) return message.reply('I cannot read text from GIF images.');
            await reactIfAble(message, client.user, '💬');
            const worker = createWorker();
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(image);
            await worker.terminate();
            await reactIfAble(message, client.user, '✅');
            if (!text) return message.reply('There is no text in this image.');
            if (text.length > 2000) {
                return message.reply('The result was over 2000 characters, so here\'s a TXT file.', {
                    files: [{ attachment: Buffer.from(text), name: 'ocr.txt' }]
                });
            }
            return message.reply(text);

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

async function reactIfAble (message, user, emoji) {
    const dm = !message.guild;
    if (dm || message.channel.permissionsFor(user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
        try {
            await message.react(emoji);
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
