const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/month'));
const { embedURL } = require(join(__dirname, '../../../Functions/Utils'));

module.exports = {
    name: 'time',
    aliases: ['time-zone'],
    description: 'Responds with the current time in a particular location.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '[month] [day]',
    run: async (client, message, [ month = '', day = ''], Discord) => {
        if (month) {
            if(validate(month)) month = parse(month);
        }
        const date = month && day ? `/${month}/${day}` : '';
        try {
            const { text } = await request.get(`http://history.muffinlabs.com/date${date}`);
            const body = JSON.parse(text);
            const events = body.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new Discord.MessageEmbed()
                .setColor(0x9797FF)
                .setURL(body.url)
                .setTitle(`On this day (${body.date})...`)
                .setDescription(`${event.year}: ${event.text}`)
                .addField('❯ See More', event.links.map(link => embedURL(link.title, link.link)).join('\n'))
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        } catch(err) {
            if (err.status === 404 || err.status === 500) return message.reply('Invalid date.');
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
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
