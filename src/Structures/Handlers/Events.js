const fs = require('fs');
const Discord = require('discord.js');
const { join } = require('path');
const Filer = require(join(__dirname, '..', '..', 'Utils', 'Filer.js'));
const config = require(join(__dirname, '..', '..', 'Config.js'));
module.exports = async function(client) {
    const container = {
        Config: config,
        Discord: Discord
    };

    Filer(join(__dirname, '..', '..', 'Events'), async function(err, res){
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const event = require(file);
            if (event.ignoreFile) return;
            if (event.customEvent) event.run(client, container);
            client.events.set(event.name, event);

            if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
            else client.on(event.name, (...args) => event.run(...args, client, container));
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
