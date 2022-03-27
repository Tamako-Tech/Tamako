const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'avatar-fusion',
    aliases: ['avatar-fuse', 'ava-fuse'],
    description: 'Draws a a user\'s avatar over a user\'s avatar.',
    ownerOnly: false,
    cooldown: 2000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user(1)] [user(2)]',
    run: async (client, message, [ base, overlay ], container) => {   
        base = base || message.author.id;
        if(!validate(base, message) || !validate(overlay, message)) return message.reply('Please provide valid user IDs.');
        base = parse(base, message);
        overlay = parse(overlay, message);
        const baseAvatarURL = base.displayAvatarURL({ format: 'png', size: 512 });
        const overlayAvatarURL = overlay.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const { body } = await request
                .get(`${process.env.API_URL}/canvas/edit-avatar/avatarFusion`)
                .query({ base: baseAvatarURL, overlay: overlayAvatarURL });
                
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Avatar Fusion')
                .setImage('attachment://avatar-fusion.png')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ files: [{ attachment: body, name: 'avatar-fusion.png' }], embeds: [embed] }); 
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
