const { join } = require('path');
const { setTimeout: delayFor } = require('timers/promises');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'bet',
    aliases: [ 'gamble' ],
    description: 'Rely on fate to increase your balance... or lower it.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '[amount]',
    run: async (client, message, [ amount ], container) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.reply(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc || doc.data.economy.wallet === null){
            return message.reply(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        } else if (!doc.data.economy.bank === null){
            return message.reply(`\\❌ **${message.author.tag}**, You don't have a **bank** yet! Won bets might be higher than wallet capacity depending on your bet amount.\nGet a bank first by typing \`${container.Config.prefix[0]}bank\`. You must have at least **2,500** coins to register to a bank!`);
        } else if (isNaN(amount)){
            return message.reply(`\\❌ **${message.author.tag}**, Please enter a valid amount.\nBets must be greater than **499** coins but less than **5,001**`);
        } else if (amount < 500 || amount > 5000){
            return message.reply(`\\❌ **${message.author.tag}**, Amount is out of range. \nBets must be greater than **499** coins but less than **5,001**`);
        } else if (amount > doc.data.economy.wallet){
            return message.reply(`\\❌ **${message.author.tag}**, You don't have enough coins in your wallet to proceed with that bet.\nGet more coins from your bank by typing \`${container.Config.prefix[0]}withdraw\`.`);
        } else {
      
            doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount);
            
            return doc.save()
                .then(() => message.reply(`\\✔️ **${message.author.tag}**, Your **${Math.floor(amount)}** has been placed in a bet. Please wait 1 minute for the result.\nOdds for winning the bet is 1/3, and amount won are twice as large up to 10x as large as the original bet!`))
                .then(async () => {
                    await delayFor(60000);

                    const won = Math.floor(Math.random() * 4) === 2 ? true : false;
                    const multiplier = Math.floor(Math.random() * 9) + 2;
                    const prize = amount * multiplier;
    
                    if (!won){
                        return message.reply(`\\❌ **${message.author.tag}**, You lost **${text.commatize(amount)}** coins from your previous bet!\nYou can get more reliable coins without using the bet command!`);
                    }

                    return profile.findByIdAndUpdate(message.author.id, {$inc: { 'data.economy.bank': prize }}, {useFindAndModify: false})
                        .then(() => message.reply(`\\✔️ **${message.author.tag}**, You won **${text.commatize(amount)}** coins from your previous bet!\nYour bet **${Math.floor(amount)}** coins have multiplied by **${multiplier}**.\nYou'll receive **${text.commatize(prize)}** coins as the prize. Your winnings has been transferred to your bank!`))
                        .catch(() => message.reply(`\`❌ Oh no! ${message.author.tag}, The betting machine just broke! You lost **${text.commatize(amount)}** coins from your previous bet.\nThis doesn't usually happen. Please contact my developer if you receive this message.`));
                }).catch(() => message.channel.send('`❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
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