const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'setcolor',
    aliases: [],
    description: 'Sets the color for your profile card.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'MANAGE_MESSAGES' ],
    category: 'Social',
    usage: '[color]',
    run: async (client, message, [color]) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }

        const hex = color?.match(/[0-9a-f]{6}|default/i)?.[0];

        if (!hex){
            return message.channel.send(`\\❌ **${message.author.tag}**, please supply a valid HEX for the color. You may go to <https://www.google.com/search?q=color+picker> to get the desired hex. You may type \`default\` to revert the color to default.`);
        }

        doc.data.profile.color = hex === 'default' ? null : String('#' + hex);

        return doc.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, your profile color has been updated to **${hex}**!`))
            .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, your profile color update failed!`));
    })
};