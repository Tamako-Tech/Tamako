const { join } = require('path');
const chatbot = require(join(__dirname, '..', 'Extensions', 'chatbot.js'));
const xp = require(join(__dirname, '..', 'Extensions', 'xp.js'));
module.exports = {
    name: 'messageCreate',
    run: async(message, client, container) => {
        const loadCommandOptions = require(join(__dirname, '..', 'Structures', 'CommandOptions', 'loadCommandOptions'));       
        chatbot(client, message, container);
        let execute;
        container.Config.prefix.forEach(prefix => {
            if (!message.content.toLowerCase().startsWith(prefix)) return;
            const cmdName = message.content.toString().toLowerCase().slice(prefix.length).trim().split(' ')[0];
            const command = client.commands.messageCommands.get(cmdName) ?? client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(cmdName));
            if (!command) return;
            if (command.allowBots) loadCommandOptions(client, message, command, false);
            else if (message.author.bot) return;
            else if (command.guildOnly == false) loadCommandOptions(client, message, command, false);
            else if (!message.guild) return;
            else {
                execute = true;
                loadCommandOptions(client, message, command, false);
            }
        });
        execute = false;
        if (!execute) xp(message);
    }
};