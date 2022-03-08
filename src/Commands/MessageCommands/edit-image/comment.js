module.exports = {
    name: 'comment',
    aliases: [],
    description: 'Comment something and return a youtube-like comment',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    category: 'Edit-Image',
    usage: '[color]',
    run: async (client, message, [ ...text ], container) => {
        if (!text) return message.reply('Please provide a text to use this command.');
        text = text.join(' ');
        try {
            return message.reply({ files: [{
                attachment: [
                    'https://some-random-api.ml/canvas/youtube-comment?avatar=',
                    message.author.displayAvatarURL({format: 'png', size:1024}),
                    `&username=${message.member.displayName}`,
                    `&comment=${text}`
                ].join(''), 
                name: 'youtube.png'}] });
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