module.exports = {
    name: 'help',
    aliases: [],
    description: 'Detailed information for a specific command.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Utility',
    usage: '[command name]',
    run: async (client, message, [item], container) => {
        if (!item) {
            return message.reply('Check out the the docs at https://tamako.tech. or Check a list of commands at https://tamako.tech/docs/Commands Or join the support server at discord.gg/dDnmY56 if you have any unanswered questions.');  
        }
        item = item.toLowerCase();
        const command = client.commands.messageCommands.get(item) || client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(item));
        if (!command) {
            return message.reply('That command doesn\'t exist.');
        }
        const embed = new container.Discord.MessageEmbed()
            .setColor('GREY')
            .setDescription(command.description)
            .setAuthor({ name: `Command Name: ${command.name}`, iconURL:  client.user.displayAvatarURL({ dynamic: true }) , url: null })
            .addFields([
                { name: 'Aliases', value: command.aliases.join(', ') || 'None' , inline: true },
                {
                    name: 'Category', value: command.category, inline: true
                },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Usage', value: `t!${command.name} ${command.usage}`}
            ]);
        if (command.extraInfo) {
            embed.addField('Extra Info', command.extraInfo);
        }
        return message.reply({ embeds: [embed]});
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */