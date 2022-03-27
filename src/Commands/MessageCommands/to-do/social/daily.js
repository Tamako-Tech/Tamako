const moment = require('moment');
const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));
// EXPERIMENTAL //
// This feature is still experimental and needs debugging.


module.exports = {
    name: 'daily',
    aliases: [ ],
    description: 'Retrieve your daily reward <3',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => profile.findById(message.author.id, async (err,doc) => {

        if (err){
            return message.channel.send(`\\❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc || doc.data.economy.wallet === null){
            return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        } else {
      
            const now = Date.now();
            const baseamount = 500;
            const rewardables = market.filter(x => ![1,2].includes(x.id));
            const supporter = await client.guilds.cache.get('744871453060759682').members.fetch(message.author.id).then(() => true).catch(() => false);
            const item = rewardables[Math.floor(Math.random() * rewardables.length)];
            let overflow = false, excess = null, streakreset = false, itemreward = false;

            if (doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - now > 0){
                return message.channel.send(`\\❌ **${message.author.tag}**, You already got your daily reward!\nYou can get your next daily reward in ${moment.duration(doc.data.economy.streak.timestamp - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}`);
            }

            if ((doc.data.economy.streak.timestamp + 864e5) < now){
                doc.data.economy.streak.current = 1;
                streakreset = true;
            }

            if (!streakreset){
                doc.data.economy.streak.current++;
                if (!(doc.data.economy.streak.current%10)){
                    itemreward = true;
                    const old = doc.data.profile.inventory.find(x => x.id === item.id);
                    if (old){
                        const inv = doc.data.profile.inventory;
                        let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
                        data.amount += 1;
                        doc.data.profile.inventory.push(data);
                    } else {
                        doc.data.profile.inventory.push({
                            id: item.id,
                            amount: 1
                        });
                    }
                }
            }

            if (doc.data.economy.streak.alltime < doc.data.economy.streak.current){
                doc.data.economy.streak.alltime = doc.data.economy.streak.current;
            }

            doc.data.economy.streak.timestamp = now + 72e6;
            const amount = baseamount + 30 * (doc.data.economy.streak.current < 25 ? doc.data.economy.streak.current : 25);

            if (doc.data.economy.wallet + amount > 5e4){
                overflow = true;
                excess = doc.data.economy.wallet + amount - 5e4;
            }

            doc.data.economy.wallet = overflow ? 5e4 : doc.data.economy.wallet + amount + (supporter ? amount * 0.2 : 0);

            // Include the streak state and overflow state in the confirmation message
            return doc.save()
                .then(() => message.channel.send([
                    `\\✔️ **${message.author.tag}**, you got your **${text.commatize(amount)}** daily reward.`,
                    supporter ? `\n\\✔️ **Thank you for your patronage**: You received **${text.commatize(amount * 0.2)}** bonus credits for being a [supporter]!` : '',
                    itemreward ? `\n\\✔️ **You received a profile item!**: You received **x1 ${item.name} - ${item.description}** from daily rewards. It has been added to your inventory!` : '',
                    overflow ? '\n\\⚠️ **Overflow Warning**: Your wallet just overflowed! You need to transfer some of your credits to your bank!' : '',
                    streakreset ? '\n\\⚠️ **Streak Lost**: You haven\'t got your succeeding daily reward. Your streak is reset (x1).' : `\n**Streak x${doc.data.economy.streak.current}**`,
                ].join('')))
                .catch(() => message.channel.send('\\❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!'));
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