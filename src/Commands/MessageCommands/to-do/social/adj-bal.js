const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'adj-bal',
    aliases: [ ],
    description: 'Manually adjust balance',
    ownerOnly: true,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '[wallet|-] [bank|-]',
    run: async (client, message, args, container) => profile.findById(message.author.id, (err, doc) => {
        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc || doc.data.economy.wallet === null){
            return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        }
        if (args.length < 2) {
            args.push('-');
        }
        const [wallet, bank] = args;
        if (!isNaN(wallet)){
            doc.data.economy.wallet = wallet;
        }
        if (!isNaN(bank)){
            doc.data.economy.bank = bank;
        }
        return doc.save()
            .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Your wallet has been set to ${wallet === '-' ? doc.data.economy.wallet : wallet} and bank to ${bank === '-' ? doc.data.economy.bank : bank}`))
            .catch(() => message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
    })
};
/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */