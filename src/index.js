require('dotenv').config();
const Discord = require('discord.js');
const { join } = require('path');
const config = require(join(__dirname, 'Config.js'));
const Handler = require(join(__dirname, 'Structures', 'Handlers', 'Handler.js'));

(async () => {
    const client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_PRESENCES,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_INVITES,
            Discord.Intents.FLAGS.GUILD_BANS
        ],
        partials: ['CHANNEL']
    });
    
    exports.client = client;
    exports.config = config;
    client.commands = {};
    client.events = new Discord.Collection();
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();
    
    await Handler.loadMessageCommands(client);
    await Handler.loadEvents(client);
    await client.login(process.env.TOKEN);
    await Handler.loadSlashCommands(client);
    await Handler.loadContextMenus(client);
    await Handler.loadButtonCommands(client);
    await Handler.loadSelectMenus(client);
})();

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */