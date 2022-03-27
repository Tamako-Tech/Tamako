module.exports = {
    name: 'allcmd',
    aliases: [],
    description: 'allcmd',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Utility',
    usage: '[command name]',
    run: async (client, message, args, container) => {

        try {

            const commands = client.commands.messageCommands.filter(cmd => { 
                return true; 
            });
            const commandsArray = commands.map(cmd => cmd); 
            let array = [];
            for (const command of commandsArray) {
                array.push({
                    name: command.name,
                    description: command.description,
                    aliases: command.aliases,
                    category: command.category,
                    cooldown: command.cooldown,
                    usage: command.usage
                });
            }
            // save array to json file
            // const json = JSON.stringify(array);
            // const fs = require('fs');

            // fs.writeFile('./commands.json', json, (err) => {
            //     if (err) console.log(err);
            // });

        } catch {
            return message.reply('Failed to send DM. You probably have DMs disabled.');
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