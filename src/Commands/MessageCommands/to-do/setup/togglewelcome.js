const { join } = require('path');
const guilds = require(join(__dirname, '..', '..', '..', '..', 'Models', 'GuildProfile.js'));

module.exports = {
    name: 'togglewelcome',
    aliases: [ ],
    description: 'Toggle the `Member Greeter` on and off.',
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
    
        doc.greeter.welcome.isEnabled = !doc.greeter.welcome.isEnabled;
    
        doc.save()
            .then(() => {
                const state = ['Disabled', 'Enabled'][Number(doc.greeter.welcome.isEnabled)];
                const profile = client.guildProfiles.get(message.guild.id);
                profile.greeter.welcome.isEnabled = doc.greeter.welcome.isEnabled;
                
                const embed = new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription([
                        '<a:animatedcheck:788340206691549204>\u2000\u2000|\u2000\u2000',
                        `Member Greeter Feature has been successfully **${state}**!\n\n`,
                        `To **${!doc.greeter.welcome.isEnabled ? 're-enable' : 'disable'}** this`,
                        `feature, use the \`${container.Config.prefix[0]}welcometoggle\` command.`,
                        !profile.greeter.welcome.message ? '\n\u2000 \\⚠️ Welcome Message has not been configured. [Learn](https://tamako.tech/) how to customize one.' : '',
                        !profile.greeter.welcome.channel ? `\n\u2000 \\⚠️ Welcome channel has not been set! Set one by using the \`${container.Config.prefix[0]}setwelcomech\` command!` : ''
                    ].join(' '))
                    .setFooter({ text: `Member Greeter | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    
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