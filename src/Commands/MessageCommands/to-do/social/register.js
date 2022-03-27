const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'register',
    aliases: [ ],
    description: 'Start earning credits. Register to keep track of your earned credits!',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.reply(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (doc && doc.data.economy.wallet !== null){
            return message.reply(`\\❌ **${message.author.tag}**, You already had a **wallet**!\nTo check your balance, type \`${container.Config.prefix[0]}bal\``);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }
      
        doc.data.economy.wallet =  Math.floor(Math.random() * 250) + 250;
      
        return doc.save()
            .then(() => message.reply(`\\✔️ **${message.author.tag}**, you were successfully registered! You received **${doc.data.economy.wallet}** as a gift!\nTo check your balance, type \`${container.Config.prefix[0]}bal\``))
            .catch((err) => { 
                console.log(err);
                message.reply('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'); 
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