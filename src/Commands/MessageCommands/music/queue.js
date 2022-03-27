module.exports = {
    name: 'queue',
    aliases: [],
    description: 'Shows the current queue for this guild!',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Music',
    usage: '',
    run: async (client, message, args, container) => {
        try { 
            if (!message.member.voice.channelId)
                return await message.reply('You are not in a voice channel to perform this');
            const dispatcher = client.queue.get(message.guild.id);
            if (!dispatcher)
                return await message.reply('Nothing is playing in this guild.');
            const queue = dispatcher.queue.length > 9 ? dispatcher.queue.slice(0, 9) : dispatcher.queue;
            const embed = new container.Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Now Playing')
                .setThumbnail(`https://img.youtube.com/vi/${dispatcher.current.info.identifier}/default.jpg`)
                .setDescription(`[${dispatcher.current.info.title}](${dispatcher.current.info.uri}) [${humanizeTime(dispatcher.current.info.length)}]`)
                .setFooter({text: `• ${dispatcher.queue.length} total songs in queue`});
            if (queue.length) embed.addField('Up Next', queue.map((track, index) => `**${index + 1}.)** \`${track.info.title}\``).join('\n'));
            return message.reply({ embeds: [ embed ] });

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
function humanizeTime(ms) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / 1000 / 60 % 60);
    return [ minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0') ].join(':');
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
