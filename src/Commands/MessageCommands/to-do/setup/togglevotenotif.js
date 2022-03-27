const { join } = require('path');
const profile  = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'togglevotenotif',
    aliases: [ ],
    description: 'Toggles your vote notification on/off',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '',
    run: async (client, message) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }
      
        if (!doc){
            doc = new profile({ _id: message.author.id });
        }

        const status = doc.data.vote.notification;
        doc.data.vote.notification = !status;
        return doc.save()
            .then(() => message.channel.send(`\\✔️ | **${message.author.tag}**, successfully __${status ? 'Disabled' : 'Enabled'}__ the vote notifications. You will now **${status ? 'stop' : 'start'}** receiving DM notifications when voting me on **top.gg**.`))
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