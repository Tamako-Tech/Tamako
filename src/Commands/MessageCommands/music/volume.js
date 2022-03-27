module.exports = {
    name: 'volume',
    aliases: [],
    description: 'Sets the volume of this playback',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Music',
    usage: '[number]',
    run: async (client, message, [ volume ], container) => {
        try {
            if (!message.member.voice.channelId)
                return await message.reply('You are not in a voice channel to perform this');
            const dispatcher = client.queue.get(message.guild.id);
            if (!dispatcher)
                return await message.reply('Nothing is playing in this guild.');
            if (dispatcher.player.connection.channelId !== message.member.voice.channelId)
                return await message.reply('You are not in the same voice channel where I am.');
            if (!volume|| isNaN(volume)) 
                return await message.reply(`\\❤ The playback volume is currently at **${dispatcher.link.player.volume}%**`);
            if (volume < 10)
                return await message.reply('\\❤ The playback volume cannot be lower than 10%');
            if (volume > 1000) 
                return await message.reply('\\❤ The playback volume cannot be higher than 1000%');
            if (volume < 10 || volume > 1000)
                return await message.reply('I am not as dumb as you think =3=');
            dispatcher.player.setVolume(volume / 100);
            return await message.channel.send(`I set the playback volume to **${volume}%**`);
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
