const fs = require('fs');
const { join } = require('path');
const Filer = require(join(__dirname, '..', '..', 'Utils', 'Filer.js'));

module.exports = async function(client) {
    Filer(join(__dirname, '..', '..', 'Commands', 'SelectMenus'), async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const selectMenu = require(file);
            if (selectMenu.ignoreFile) return;
            client.commands.selectMenus.set(selectMenu.name, selectMenu);
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
