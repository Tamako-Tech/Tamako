const request = require('node-superfetch');
const { join } = require('path');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image-or-avatar'));

module.exports = {
    name: 'challenger',
    aliases: ['challenger-approaching'],
    description: 'Draws an image or a user\'s avatar over Smash Bros.\'s "Challenger Approaching" screen.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Meme',
    usage: '[silhouetted: false/true] [image]',
    run: async (client, message, [ silhouetted, image ], container) => {
        
        if (silhouetted === 'false' || silhouetted === 'f' || silhouetted === 'no' || silhouetted === 'n' || silhouetted === 'off' || silhouetted === 'disable' || silhouetted === 'disabled' || silhouetted === '0' || silhouetted === '-') {
            silhouetted = 0;
        } else {
            silhouetted = 1;
        }
        image = image || message.attachments.first() || message.author.displayAvatarURL({ format: 'png', size: 512 });
        if (!image) return message.reply('Please provide an image or avatar to use this command.');
        if (!validate(image, message)) return message.reply('Please provide an image or avatar to use this command.');
        image = await parse(image, message);

        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/challenger`)
                .query({ silhouetted: silhouetted, image: image });
            
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://challenger.png')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: body, name: 'challenger.png' }] });
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