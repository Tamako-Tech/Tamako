const { join } = require('path');
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'previewitem',
    aliases: [ 'viewitem' ],
    description: 'Check what you can buy from the shop.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '[id]',
    run: async (client, message, [id]) => {

        if (!id){
            return message.channel.send(`\\❌ **${message.author.tag}**,Please specify the id!`);
        }

        let selected = market.find(x => x.id == id);

        if (!selected){
            return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with that id!`);
        }

        return message.channel.send(`name: **${selected.name}**, type: **${selected.type}**, price: **${text.commatize(selected.price)}**`,{
            embed: { image: { url: selected.assets.link }, color: 9807270 }
        });
    }
};