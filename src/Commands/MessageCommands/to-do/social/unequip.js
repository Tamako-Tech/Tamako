const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'unequip',
    aliases: [],
    description: 'Unequip something',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'MANAGE_MESSAGES' ],
    category: 'Social',
    usage: '[type]',
    run: async (client, message, [type] ) => profile.findById(message.author.id, async (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }

        const types = ['background','pattern','emblem','hat','wreath'];
        if (!types.includes(type.toLowerCase())){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please select one of the following: \`${types.join('`, `')}\``);
        }

        doc.data.profile[type.toLowerCase()] = null;

        return doc.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully unequipped **${type}!**`))
            .catch(() => message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
    })
};