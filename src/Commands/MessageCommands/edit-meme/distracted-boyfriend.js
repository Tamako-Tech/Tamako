const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'distracted-boyfriend',
    aliases: ['man-looking-at-other-woman', 'jealous-girlfriend'],
    description: 'Draws three user\'s avatars over the "Distracted Boyfriend" meme.',
    ownerOnly: false,
    cooldown: 2000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Meme',
    usage: '[user(1)] [user(2)] [user(3)]',
    run: async (client, message, [ otherGirl, girlfriend, boyfriend ], container) => {   
        otherGirl = otherGirl || message.author.id;
        if (!otherGirl || !girlfriend || !boyfriend) return message.reply('Please provide a valid user to use this command.');
        if(!validate(otherGirl, message) || !validate(girlfriend, message) || !validate(boyfriend)) return message.reply('Please provide valid user IDs.');
        otherGirl = parse(otherGirl, message);
        girlfriend = parse(girlfriend, message);
        boyfriend = parse(boyfriend, message);
        const boyfriendAvatarURL = boyfriend.displayAvatarURL({ format: 'png', size: 256 });
        const girlfriendAvatarURL = girlfriend.displayAvatarURL({ format: 'png', size: 256 });
        const otherGirlAvatarURL = otherGirl.displayAvatarURL({ format: 'png', size: 256 });
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-meme/distracted-boyfriend`)
                .query({ otherGirlAvatarURL: otherGirlAvatarURL, boyfriendAvatarURL: boyfriendAvatarURL, girlfriendAvatarURL: girlfriendAvatarURL });
                
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setImage('attachment://distracted-boyfriend.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: body, name: 'distracted-boyfriend.png' }], embeds: [embed] }); 
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
