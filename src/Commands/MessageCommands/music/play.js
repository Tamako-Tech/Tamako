module.exports = {
    name: 'play',
    aliases: [],
    description: 'Play Music',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Music',
    usage: '[Name / link to music or playlist]',
    run: async (client, message, args, container) => {
        try {
            if (!message.member.voice.channelId)
                return await message.reply('You are not in a voice channel');
            if (!args[0])
                return await message.reply('You did not specify a link or search mode');
            const node = client.shoukaku.getNode();
            const query = args.join(' ');
            if (_checkURL(query)) {
                const result = await node.rest.resolve(query);
                if (!result)
                    return await message.reply('I didn\'t find anything in the query you gave me');
                const { type, tracks, playlistName } = result;
                const track = tracks.shift();
                const isPlaylist = type === 'PLAYLIST';
                const res = await client.queue.handle(message.guild, message.member, message.channel, node, track);
                if (isPlaylist) {
                    for (const track of tracks) await client.queue.handle(message.guild, message.member, message.channel, node, track);
                }   
                await message.reply(isPlaylist ? `Added the playlist **${playlistName}** in queue!` : `Added the track **${track.info.title}** in queue!`)
                    .catch(() => null);
                if (res) res.play();
                return;
            }
            const searchData = await node.rest.resolve(query, 'youtube');
            if (!searchData || !searchData.tracks.length)
                return await message.reply('I didn\'t find anything in the query you gave me');
            const track = searchData.tracks.shift();
            const res = await client.queue.handle(message.guild, message.member, message.channel, node, track);
            await message.reply(`Added the track **${track.info.title}** in queue!`).catch(() => null);
            if (res) res.play();
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

function _checkURL(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}
/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
