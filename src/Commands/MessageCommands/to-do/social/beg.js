const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'beg',
    aliases: [ 'plead' ],
    description: 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
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
            return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        } else {
      
            const now = Date.now();
            const duration = Math.floor(Math.random() * 7200000) + 3600000;
            const beg = client.collections.economy.get('beg') || client.collections.economy.set('beg', new container.Discord.Collection()).get('beg');
            const userprofile = beg.get(message.author.id) || beg.set(message.author.id, { date: 0 }).get(message.author.id);
            let overflow = false, excess = null;
      
            if (userprofile.date > now){
                return message.channel.send(`\\❌ **${message.author.tag}**, You have already been given some *coins* earlier! Please try again later.`);
            }
      
            userprofile.date = Date.now() + duration;
            const amount = Math.floor(Math.random() * 200) + 100;
      
            if (doc.data.economy.wallet + amount > 50000){
                overflow = true;
                excess = doc.data.economy.wallet + amount - 50000;
            }
      
            doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;
      
            return doc.save()
                .then(() => message.channel.send([
                    `\\✔️ **${message.author.tag}**, You received **${amount}** from me.`,
                    overflow ? `\n⚠️Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount-excess} for this one!` :'',
                    `\nTo Check your balance, type \`${container.Config.prefix[0]}bal\`\n`,
                    'Keep your wallet from *overflowing* --> <https://tamako.tech/docs/Setup/Economy#overflow)>'
                ].join('')))
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