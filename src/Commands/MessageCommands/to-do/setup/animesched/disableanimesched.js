const { join } = require('path');
const list = require(join(__dirname, '..', '..', '..', '..', '..', 'Models', 'GuildWatchlist'));
module.exports = {
    name: 'disableanisched',
    aliases: [ 'anischedoff' ],
    description: 'Disable the anisched feature for this server',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '[Channel ID/Mention]',
    run: async (client, message, args, container) => list.findById(message.guild.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }
        if (!doc){
            doc = new list({ _id: message.guild.id });
        }
    
        if (doc.channelID === null){
            return message.channel.send(`\\❌ Anischedule is already disabled on this server! You may enable it again through \`${container.Config.prefix[0]}setanischedch\``);
        }
    
        doc.channelID = null;
        return doc.save()
            .then(() => {
                return message.channel.send(`\\✔️ Successfully disabled the Anisched feature! You may enable it again through \`${container.Config.prefix[0]}setanischedch\``);
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