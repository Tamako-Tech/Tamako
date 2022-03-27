const { join } = require('path');
const profile = require(join(__dirname,'..', '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'xpreset',
    aliases: [ 'resetxp', 'resetserverxp' ],
    description: 'Resets the xp of all users for this server',
    ownerOnly: false,
    dbRequired: true,
    cooldown: 0,
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '',
    run: async (client, message) => {
        await message.channel.send('This will **reset** all experience points in this server (Action irreversible). Continue?');
        
        const msg_filter = (m) => m.author.id === message.author.id;
        const continued = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);

        if (!continued){
            return message.channel.send(`\\❌ **${message.author.tag}**, cancelled the xpreset command!`);
        }
        return profile.updateMany({'data.xp.id': message.guild.id }, {
            $pull: { 'data.xp' : { id: message.guild.id }}
        }, (err, res) => {
            if (err){
                return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
            } else if (res.nModified == 0){
                return message.channel.send(`\\❌ **${message.author.tag}**, this server has no xp data to be cleared of!`);
            } else {
                return message.channel.send(`\\✔️ **${message.author.tag}**, this server's xp has been reset. (Cleared **${res.nModified}** xpdocs)`);
            }
        });
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */