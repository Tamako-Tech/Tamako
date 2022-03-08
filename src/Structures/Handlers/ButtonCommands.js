const fs = require('fs');
const { join } = require('path');
const Filer = require(join(__dirname, '..', '..', 'Utils', 'Filer.js'));

module.exports = async function(client) {
    Filer(join(__dirname, '..', '..', 'Commands', 'ButtonCommands'), async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const button = require(file);
            if (button.ignoreFile) return;
            client.commands.buttonCommands.set(button.name, button);
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
