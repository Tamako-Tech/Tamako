module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Sets the repeat mode of this playback',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Music',
    usage: '[one/all/off]',
    run: async (client, message, [ mode ], container) => {
        try {
            if (!message.member.voice.channelId)
                return await message.reply('You are not in a voice channel to perform this');
            const dispatcher = client.queue.get(message.guild.id);
            if (!dispatcher)
                return await message.reply('Nothing is playing in this guild.');
            if (dispatcher.player.connection.channelId !== message.member.voice.channelId)
                return await message.reply('You are not in the same voice channel where I am.');
            if (!mode)  return await message.reply('Please specify a mode to set the repeat mode to.');
            mode = mode.toLowerCase();
            if (!(mode === 'one' || mode === 'all' || mode === 'off')) return await message.reply('Please specify a valid mode to set the repeat mode to.\nAvailable options: `one`, `all`, `off`');
            dispatcher.repeat = mode;
            return message.reply(`the repeat playback mode is now set to \`${dispatcher.repeat}\`!`);
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
