const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'bal',
    aliases: [ 'balance', 'credits' ],
    description: 'Check your wallet, how much have you earned?',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => profile.findById(message.author.id, (err, doc) => {

        if (err){
            return message.reply(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        }
      
        if (!doc || doc.data.economy.wallet === null){
            return message.reply(`\\❌ **${message.author.tag}**, you don't have a wallet yet! To create one, type \`${container.Config.prefix[0]}register\`.`);
        }
      
        const dailyUsed = doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - Date.now() > 0;

        function bunnify(cur, max){
            const active = '<:active:810955006660050944>', inactive = '<:inactive:810955040289325076>', left = max - cur === 10 ? 0 : max - cur;
            if (left === 0){
                return dailyUsed ? active.repeat(10) : inactive.repeat(10);
            } else {
                return active.repeat(cur || max) + inactive.repeat(left);
            }
        }

        const embed = new container.Discord.MessageEmbed()
            .setColor(0xe620a4)
            .setAuthor({ name: `${message.author.tag}'s Wallet`})
            .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
            .setDescription(
                `\u200b\n💰 **${
                    text.commatize(doc.data.economy.wallet)
                }** credits in wallet.\n\n${
                    doc.data.economy.bank !== null
                        ? `💰 **${text.commatize(doc.data.economy.bank)}** credits in bank.`
                        : `Seems like you don't have a bank yet. Create one now by typing \`${
                            container.Config.prefix[0]
                        }bank\``
                }\n\n━━━━━━━━━━━━━━\nDaily Streak: **${doc.data.economy.streak.current}** (All time best: **${doc.data.economy.streak.alltime}**)\n**${10 - doc.data.economy.streak.current % 10}** streak(s) left for **Item Reward \\✨**\n\n${
                    bunnify(doc.data.economy.streak.current % 10, 10)
                }\n━━━━━━━━━━━━━━\n${
                    dailyUsed ? '\\✔️ Daily reward already **claimed**!' : '\\⚠️ Daily reward is **avaliable**!'
                }`
            )
            .setFooter({ text: `Profile Balance | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    
    
        return message.channel.send({ embeds: [ embed ] });
    })
};
/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */