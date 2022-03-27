module.exports = {
    name: 'stop',
    aliases: [],
    description: 'Stops the playback',
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
            if (dispatcher.player.connection.channelId !== message.member.voice.channelId)
                return await message.reply('You are not in the same voice channel where I am.');
            dispatcher.queue.length = 0;
            dispatcher.player.stopTrack();
            return message.reply('I stopped the song!');
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
