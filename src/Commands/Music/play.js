const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    config: {
      name: 'play', // Command name.
      description: 'To play music', // Command description.
      usage: 'play [song name]' // The usage of the command, use for an example: [...] = required argument, else (...) not required argument.
    },
    permissions: ['SendMessages'], // Command permissions, could be 'sendMessages', 'banMembers'... etc.
    owner: false, // Could be true or false.
    run: async (client, message, args) => { // Command functionality.
        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(['Speak', 'Connect']))) return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`I don't have enough permissions to execute this command! please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`You need to be in a voice channel to execute this command!`)] });
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.resolve(['Speak', 'Connect']))) return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`I don't have enough permissions connect your vc please give me permission \`CONNECT\` or \`SPEAK\`.`)] });
    try {
        const node = client.shoukaku.getNode();
        const query = args.join(' ');
        if (_checkURL(query)) {
            const result = await node.rest.resolve(query);
            if (!result?.tracks.length) 
                return await message.reply('I didn\'t find anything in the query you gave me');
            const track = result.tracks.shift();
            const playlist = result.loadType === 'PLAYLIST_LOADED';
            const isPlaylist = type === 'PLAYLIST';
            const dispatcher  = await client.queue.handle(message.guild, message.member, message.channel, node, track);
            if (dispatcher === 'Busy')
                return await message.reply('I\'m already playing music in this guild!');
            if (playlist){
                for (const track of result.tracks)
                    await client.queue.handle(message.guild, message.member, message.channel, node, track);
            }
            await message.reply(playlist ? `Added the playlist \`${result.playlistInfo.name}\` in queue!` : `Added the track \`${track.info.title}\` in queue!`);
            dispatcher?.play();
            return;
        }
        const search = await node.rest.resolve(`ytsearch:${query}`);
        if (!search?.tracks.length)
            return await message.reply('I didn\'t find anything in the query you gave me');
        const track = search.tracks.shift();
        const dispatcher = await client.queue.handle(message.guild, message.member, message.channel, node, track);
        if (dispatcher === 'Busy')
            return await message.reply('I\'m already playing music in this guild!');
        await message.reply(`Added the track \`${track.info.title}\` in queue!`);
        dispatcher?.play();
        return;
    } catch(err) {
        console.log(err);
        return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`t!feedback\` command`, embeds: [ 
            new EmbedBuilder()
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