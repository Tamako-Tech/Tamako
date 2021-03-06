const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));

module.exports = {
    name: 'equip',
    aliases: [ 'use' ],
    description: 'Equip an item',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '[id]',
    run: async (client, message, [id] ) => profile.findById(message.author.id, async (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }

        const item = doc.data.profile.inventory.find(x => x.id == id);

        if (!item){
            return message.channel.send(`\\❌ **${message.author.tag}**, you do not have this item in your inventory!`);
        }

        const metadata = market.find(x => x.id === item.id);

        if (!metadata){
            return message.channel.send(`\\❌ **${message.author.tag}**, this item can no longer be used!`);
        }

        doc.data.profile[metadata.type] = metadata.assets.link;

        return doc.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully used **${metadata.name}!**`))
            .catch(() => message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
    })
};