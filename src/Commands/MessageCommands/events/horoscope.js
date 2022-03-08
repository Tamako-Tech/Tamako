const { join } = require('path');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const signs = require(join(__dirname, '..', '..', '..', 'assets', 'json', 'horoscope.json'));
const { firstUpperCase } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'horoscope',
    aliases: [],
    description: 'Responds with today\'s horoscope for a specific Zodiac sign.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[sign]',
    run: async (client, message, [ sign ], container) => {
        if (!sign) return message.reply('Incorrect Usage.\nUsage: `t!horoscope [sign]`');
        const signIndex = signs.findIndex(s => s.toLowerCase() === sign.toLowerCase());
        if (signIndex === -1) return message.reply(`Type a correct sign.\n Available Signs: ${signs.join(', ')}`);
        try {
            const horoscope = await fetchHoroscope(sign);


            const embed = new container.Discord.MessageEmbed()
                .setColor(0x9797FF)
                .setTitle(`Horoscope for ${firstUpperCase(sign)}...`)
                .setURL(`https://astrology.tv/horoscope/signs/${sign}/`)
                .setThumbnail(getImageURL(sign))
                .setTimestamp()
                .setDescription(horoscope)
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

async function fetchHoroscope(sign) {
    const { text } = await request.get(`https://astrology.tv/horoscope/signs/${sign}/`);
    const $ = cheerio.load(text);
    return $('div[class="ct-text-block day-tabs-content_horoscope"]').eq(1).text();
}

function getImageURL(sign) {
    return `https://astrology.tv/wp-content/uploads/2019/07/astrology_tv_${sign}_cover-768x768.jpg`;
}



/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
