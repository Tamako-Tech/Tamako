const { join } = require('path');
const request = require('node-superfetch');
const moment = require('moment');
require('moment-duration-format');
const { tomorrow } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const locales = ['en', 'jp'];

module.exports = {
    name: 'neko-atsume-password',
    aliases: ['neko-atsume', 'neko-password', 'neko-atsume-pswd', 'neko-pswd'],
    description: 'Responds with where the Internation Space Station currently is.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[locale]',
    run: async (client, message, [ locale = 'en' ], container) => {
        locale = locale.toLowerCase();
        if (!locales.includes(locale)) return message.reply(`\`${locale}\` is not a valid locale. Avaiable locales are: \`${locales.join('`, `')}\``);
        try {
            const data = await fetchPassword(locale);
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setAuthor(`Expires in ${moment.duration(data.expires - data.date).format('hh:mm:ss', { trim: false })}`)
                .setDescription(`The current Neko Atsume password is **${data.password}**.\n\n${data.gold} Gold Fish ${data.silver} Silver Fish`)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};
async function fetchPassword(locale) {
    const { text } = await request
        .get(`http://hpmobile.jp/app/nekoatsume/neko_daily${locale === 'jp' ? '' : `_${locale}`}.php`);
    const data = text.split(',');
    const date = new Date();
    date.setUTCHours(9);
    return {
        password: data[1],
        silver: data[2],
        gold: data[3],
        date,
        expires: tomorrow(9)
    };
}



/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
