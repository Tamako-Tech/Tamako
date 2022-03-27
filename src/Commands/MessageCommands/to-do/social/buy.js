const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));
module.exports = {
    name: 'buy',
    aliases: [ ],
    description: 'Check what you can buy from the shop.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '[item] [amount]',
    run: async (client, message, [ id, amt ], container) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }
      
        const item = market.find(x => x.id == id);
      
        if (!item){
            return message.channel.send([
                `\\❌ **${message.author.tag}**, Could not find the item ${id ? `with id **${id}**` : 'without id'}!`,
                `The proper usage for this command would be \`${container.Config.prefix[0]}buy [item id] <amount>\`.`,
                `Example: \`${container.Config.prefix[0]}buy ${Math.floor(Math.random() * market.length)}\``
            ].join('\n'));
        }
      
        amt = Math.floor(Math.abs(amt)) || 1;
        const total = item.price * amt;
      
        if (!item.price && amt > 1){
            return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
        } else if (amt > 1000){
            return message.channel.send(`\\❌ **${message.author.tag}**, You cannot purchase more than **1,000** items at once.`);
        } else if (doc.data.economy.wallet < total){
            return message.channel.send([
                `\\❌ **${message.author.tag}**, You do not have enough credits to proceed with this transaction!`,
                `You need **${text.commatize(total - doc.data.economy.wallet)}** more for **${amt}x ${item.name}**`
            ].join('\n'));
        } else if (doc.data.profile.inventory.find(x => x.id === item.id) && !item.price){
            return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
        } else {
      
            const old = doc.data.profile.inventory.find(x => x.id === item.id);
            if (old){
                const inv = doc.data.profile.inventory;
                let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
                data.amount = data.amount + amt;
                doc.data.profile.inventory.push(data);
            } else {
                doc.data.profile.inventory.push({
                    id: item.id,
                    amount: amt
                });
            }
      
            doc.data.economy.wallet = doc.data.economy.wallet - total;
            return doc.save()
                .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully purchased **${amt}x ${item.name}!**`))
                .catch(() => message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
        }
    })
};
/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */