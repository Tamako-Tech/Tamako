const moment = require('moment');

module.exports = {
    name: 'clear',
    aliases: [],
    description: 'Clear messages from the channel.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    category: 'Moderation',
    usage: '<amount of messages>',
    run: async (client, message, [ quantity ], Discord) => {
        quantity = Math.round(quantity);

        if (!quantity || quantity < 2 || quantity > 100){
            return message.reply(`<:cancel:788323084770738216> | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`);
        }
    
        try {
            message.channel.bulkDelete(quantity, true)
                .then(async messages => {
    
                    const count = messages.size;
                    const _id = Math.random().toString(36).slice(-7);
                    const uploadch = client.channels.cache.get(process.env.LOGS_CHANNEL);
    
                    messages = messages.filter(Boolean).map(message => {
                        return [
                            `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
                            `${message.author.tag} : ${message.content}\r\n\r\n`
                        ].join(' ');
                    });
    
                    messages.push(`Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
                    messages = messages.reverse().join('');
    
                    const res = uploadch ? await uploadch.send({content: `BULKDELETE FILE - ${message.guild.id} ${message.channel.id}`, files: [{ attachment: Buffer.from(messages), name: `bulkdlt-${_id}.txt`}]}
                    ).then(message => [message.attachments.first().url, message.attachments.first().id])
                        .catch(() => ['', null]) : ['', null];
                    const url = (res[0].match(/\d{17,19}/)||[])[0];
                    const id = res[1];
    
                    const embed = new Discord.MessageEmbed()
                        .setColor('GREY')
                        .setDescription([
                            `[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url}/${id}/bulkdlt-${_id}`:''})`,
                            `[\`📩 Download\`](${res[0]})`
                        ].join('\u2000\u2000•\u2000\u2000'));

                    return message.reply({content: `Successfully deleted **${count}** messages from this channel!`, embeds: [embed] });
                });
        } catch(err) {
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
