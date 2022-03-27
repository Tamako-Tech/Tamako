const fs = require('fs');
const { join } = require('path');
const Filer = require(join(__dirname, '..', '..', 'Utils', 'Filer.js'));

module.exports = async function(client) {
    Filer(join(__dirname, '..', '..', 'Commands', 'MessageCommands'), async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const command = require(file);
            if (command.ignoreFile) return;
            if (command.dbRequired && !client.dbConnected) return console.log(`[] Couldn't load command ${command.name} because the database is not connected.`);          
            command.location = file;
            if (client.commands.messageCommands.has(command.name)) return console.log(`[] Couldn't load command ${command.name} because it already exists. ${file} `);
            client.commands.messageCommands.set(command.name.toLowerCase(), command);
            if (command.aliases) command.aliases.forEach(alias => client.commands.messageCommands.aliases.set(alias.toLowerCase(), command.name.toLowerCase()));
        });
    });
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
