const { join } = require('path');
const request = require('node-superfetch');
const { decode: decodeHTML } = require('html-entities');
const { embedURL } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'days-until',
    aliases: [],
    description: 'Responds with how many days there are until a certain date.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [day] [year]',
    run: async(client, message, args, container) => {
        try {
            const { text } = await request.get('https://thebulletin.org/doomsday-clock/past-statements/');
            const time = text.match(/<h3 class="uabb-infobox-title">(.+)<\/h3>/)[1];
            const year = text.match(/<h5 class="uabb-infobox-title-prefix">(.+)<\/h5>/)[1];
            const description = text.match(/<div class="uabb-infobox-text uabb-text-editor">(.|\n)+<p>(.+)<\/p>/)[2]
                .replace(/<a href="(.+)" target="_blank" rel="noopener">(.+)<\/a>/, embedURL('$2', '$1'));
            const embed = new container.Discord.MessageEmbed()
                .setTitle(`${year}: ${time}`)
                .setColor(0x000000)
                .setURL('https://thebulletin.org/doomsday-clock/current-time/')
                .setAuthor('Bulletin of the Atomic Scientists', undefined, 'https://thebulletin.org/')
                .setDescription(decodeHTML(description))
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
