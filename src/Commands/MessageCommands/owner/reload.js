
module.exports = {
    name: 'reload',
    aliases: [],
    description: 'Reload commands.',
    ownerOnly: true,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Owner',
    usage: '',
    run: async (client, message, [commandName], container) => {   
        commandName = commandName.toLowerCase();
        let commandFile = client.commands.messageCommands.get(commandName) || client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(commandName));
        try {
    
            if (!commandFile) return message.reply({ content: `Command \`${commandName}\` not found.`, embeds: [
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${commandName}\` is not a valid command.`)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
            
            delete require.cache[require.resolve(commandFile.location)];
            // register it again
            const newCommand = require(commandFile.location);
            client.commands.messageCommands.set(newCommand.name.toLowerCase(), newCommand);
            newCommand.location = commandFile.location;
            if (newCommand.aliases) newCommand.aliases.forEach(alias => client.commands.messageCommands.aliases.set(alias.toLowerCase(), newCommand.name.toLowerCase()));
        
            return message.reply({embeds: [
                new container.Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Success')
                    .setDescription(`\`${newCommand.name}\` has been reloaded.`)
                    .setFooter({ text: `Success | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
            
        } catch(err) {
            console.log(err);
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
