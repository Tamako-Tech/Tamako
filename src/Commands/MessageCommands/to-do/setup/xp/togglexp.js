const { join } = require('path');
const guilds = require(join(__dirname,'..', '..', '..', '..', '..', 'Models', 'GuildProfile.js'));

module.exports = {
    name: 'xptoggle',
    aliases: ['togglexp'],
    description: 'Toggle the xp system on/off for the server.',
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
      
        doc.xp.isActive = !doc.xp.isActive;
    
        doc.save()
            .then(() => {
                const state = ['Disabled', 'Enabled'][Number(doc.xp.isActive)];
                const profile = client.guildProfiles.get(message.guild.id);

                profile.xp.isActive = doc.xp.isActive;
                const embed = new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription([
                        '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
                        `XP Feature has been successfully **${state}**!\n\n`,
                        `To **${!doc.xp.isActive ? 're-enable' : 'disable'}** this`,
                        `feature, use the \`${container.Config.prefix[0]}xptoggle\` command.`
                    ].join(' '))
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