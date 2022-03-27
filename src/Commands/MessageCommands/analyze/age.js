module.exports = {
    name: 'age',
    aliases: [],
    description: 'Responds with how old someone born in a certain year is.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[year]',
    run: async (client, message, [ year ], container) => {   
        if (year < 1) return message.reply('Please enter a valid year.');
        try {
            const currentYear = new Date().getFullYear();
            const age = currentYear - year;
            let embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`Someone born in ${year} will be born in ${Math.abs(age)} years.`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            if (age < 0) return message.reply({ embeds: [embed] });

            return message.reply({ embeds: [embed.setDescription(`You are ${Math.abs(age)} years old.`)] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
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
