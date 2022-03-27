const { join } = require('path');
const guilds = require(join(__dirname, '..', '..', '..', '..', 'Models', 'GuildProfile.js'));

module.exports = {
    name: 'setgoodbyech',
    aliases: [ ],
    description: 'Set up the goodbye channel',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '[Channel ID/Mention]',
    run: async (client, message, [ channel = '' ], container) => guilds.findById(message.guild.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new guilds({ _id: message.guild.id });
        }
    
        const channelID = (channel.match(/\d{17,19}/)||[])[0];
        channel = message.guild.channels.cache.get(channelID);
        if (!channel || channel.type !== 'GUILD_TEXT'){
            return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID or channel mention.`);
        } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
            return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`);
        } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
            return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`);
        }
    
        doc.greeter.leaving.channel = channel.id;
        return doc.save()
            .then(() => {
                const profile = client.guildProfiles.get(message.guild.id);
                profile.greeter.leaving.channel = doc.greeter.leaving.channel;
                

                const embed = new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription([
                        '<a:animatedcheck:788340206691549204>\u2000\u2000|\u2000\u2000',
                        `Successfully set the goodbye channel to ${channel}!\n\n`,
                        !profile.greeter.leaving.isEnabled ? `\\⚠️ Leaving Member Announcer is disabled! To enable, type \`${container.Config.prefix[0]}goodbyetoggle\`\n` :
                            `To disable this feature, use the \`${container.Config.prefix[0]}goodbyetoggle\` command.`
                    ].join(''))
                    .setFooter({ text: `Leaving Member Announcer | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    
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