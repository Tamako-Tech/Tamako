const { join } = require('path');
const guilds = require(join(__dirname, '..', '..', '..', '..', 'Models', 'GuildProfile.js'));

module.exports = {
    name: 'togglegoodbye',
    aliases: [ ],
    description: 'Toggle the `Leaving Member Announcer` on and off.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '',
    run: async (client, message, args, container) => guilds.findById(message.guild.id, (err, doc) => {

        if (err){
            return message.reply(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }
    
        if (!doc){
            doc = new guilds({ _id: message.guild.id });
        }
    
        doc.greeter.leaving.isEnabled = !doc.greeter.leaving.isEnabled;
    
        doc.save()
            .then(() => {
                const state = ['Disabled', 'Enabled'][Number(doc.greeter.leaving.isEnabled)];
                const profile = client.guildProfiles.get(message.guild.id);

                profile.greeter.leaving.isEnabled = doc.greeter.leaving.isEnabled;
                const embed = new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription([
                        '<a:animatedcheck:788340206691549204>\u2000\u2000|\u2000\u2000',
                        `Leaving Member Announcer Feature has been successfully **${state}**!\n\n`,
                        `To **${!doc.greeter.leaving.isEnabled ? 're-enable' : 'disable'}** this`,
                        `feature, use the \`${container.Config.prefix[0]}goodbyetoggle\` command.`,
                        !profile.greeter.leaving.message ? '\n\u2000 \\⚠️ LMA Message has not been configured. [Learn](https://tamako.tech/) how to customize one.' : '',
                        !profile.greeter.leaving.channel ? `\n\u2000 \\⚠️ LMA channel has not been set! Set one by using the \`${container.Config.prefix[0]}setgoodbyech\` command!` : ''
                    ].join(' '))
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