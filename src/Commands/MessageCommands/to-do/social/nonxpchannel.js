const { join } = require('path');
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'nonxpchannels',
    aliases: ['nonxpchannel'],
    description: 'See which channels do not give xp',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => {
        try{
            let totalch = message.guild.channels.cache.filter(c => c.send).size;
            let channels = client.guildProfiles.get(message.guild.id).xp.exceptions;
    
            channels = channels.map(x => client.channels.cache.get(x).toString());

            if (!channels.length){
                return message.channel.send(`\\✔️ **${message.member.displayName}**, All channels in this server are xp-enabled!`);
            } else if (totalch === channels.length){
                return message.channel.send(`\\❌ **${message.member.displayName}**, All channels in this server are xp-disabled!`);
            } else {
                return message.channel.send({ embeds: [
                    new container.Discord.MessageEmbed()
                        .setColor('ORANGE')
                        .setFooter({text: `XP | ©️${new Date().getFullYear()} Tamako`})
                        .setDescription([
                            '\\⚠️\u2000\u2000|\u2000\u2000',
                            `XP SYSTEM are disabled on ${text.joinArray(channels)}`
                        ].join(''))
                ]});
            }
        } catch (err) {
            return message.channel.send(`\\❌ **${message.member.displayName}**, There was an error while trying to get the list of channels.`);
        }
    }
};