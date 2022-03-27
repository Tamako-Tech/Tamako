const { join } = require('path');
const guilds = require(join(__dirname,'..', '..', '..', '..', '..', 'Models', 'GuildProfile.js'));

module.exports = {
    name: 'xpexcempt',
    aliases: ['excemptxp', 'disablexpon', 'xpdisableon'],
    description: 'Disable collecting xp on mentioned channels',
    ownerOnly: false,
    dbRequired: true,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '',
    run: async (client, message, args, container) => guilds.findById(message.guild.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new guilds({ _id: message.guild.id });
        }
      
        const channels = message.mentions.channels.map( c => c.id);

        if (!channels.length){
            return message.channel.send(`\\❌ **${message.member.displayName}**, Please mention the channel(s) you want me to not collect xp from.`);
        }

        let newch = [];
        let oldch = [];

        for (const channelID of channels) {
            if (doc.xp.exceptions.includes(channelID)){
                oldch.push(channelID);
            } else {
                newch.push(channelID);
            }
        }

        if (!newch.length){
            oldch = oldch.map(c => client.channels.cache.get(c).toString().toString()).join(', ');
            return message.channel.send(`\\❌ **${message.member.displayName}**, The mentioned channels ${oldch} are already in the excempt list.`);
        }

        doc.xp.exceptions.push(...newch);
    
        doc.save()
            .then(() => {
                client.guildProfiles.get(message.guild.id).xp.exceptions = doc.xp.exceptions;
                
                const embed = new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription([
                        '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
                        'XP [Experience Points System] will now be disabled on ',
                        newch.map(c => client.channels.cache.get(c).toString()).join(', '),
                        oldch.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${oldch.map(c => client.channels.cache.get(c).toString()).join(', ')} are already on excempted list.`: '',
                        '\n\nTo see which channels do not give xp, use the command `nonxpchannels`'
                    ].join(''))
                    .setFooter({ text: `XP | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    
                return message.channel.send({ embeds: [ embed ] });
            })
            .catch((err) => {
                console.log(err);
                return message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!');
            });
    })
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */