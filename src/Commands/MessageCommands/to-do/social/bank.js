const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'bank',
    aliases: [ 'registerbank' ],
    description: 'Check your wallet, how much have you earned?',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc || doc.data.economy.wallet === null){
            return message.channel.send(`\\❌ **${message.author.tag}**, Bank requires coins to register, but you don't have a *wallet* yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        } else if (doc.data.economy.bank !== null){
            return message.channel.send(`\\❌ **${message.author.tag}**, You already have a bank account.\n`);
        } else if (doc.data.economy.wallet < 2500){
            return message.channel.send(`\\❌ **${message.author.tag}**,  it seems like you don't have enough coins to register in a bank ((***${text.commatize(2500 - doc.data.economy.wallet)}** more coins are needed*).`);
        } else {
            doc.data.economy.wallet = doc.data.economy.wallet - 2500;
            doc.data.economy.bank = 2500;
      
            return doc.save()
                .then(() => message.channel.send(`✔️ **${message.author.tag}**, Registered to a bank! The **2,500** fee was transferred to your bank. To check your balance, type \`${container.Config.prefix[0]}bal\``))
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