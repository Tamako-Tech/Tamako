require('dotenv').config();
require('./fonts');
const Cluster = require("discord-hybrid-sharding");
const Discord = require('discord.js');
const { join } = require('path');
const config = require(join(__dirname, 'config.js'));
const Handler = require(join(__dirname, 'Structures', 'Handlers', 'Handler.js'));
const GuildProfilesManager = require(join(__dirname, 'Extensions', 'guilds', 'ProfileManager.js'));
const Anischedule  = require(join(__dirname, 'Extensions', 'Misc', 'Anischedule.js'));
const Collections  = require(join(__dirname, 'Extensions', 'Misc', 'Collections.js'));
const ShoukakuHandler = require(join(__dirname, 'Extensions', 'Music', 'Handler.js'));
const Queue = require(join(__dirname, 'Extensions', 'Music', 'Queue.js'));
const db = require(join(__dirname, 'Extensions', 'mongoose'));

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
        shards: Cluster.data.SHARD_LIST,
        shardCount: Cluster.data.TOTAL_SHARDS, 
        partials: ['CHANNEL']
    });    
    exports.client = client;
    exports.config = config;
    client.cluster = new Cluster.Client(client);
    await db(client);
    client.commands = {};
    client.events = new Discord.Collection();
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();
    client.guildProfiles = new GuildProfilesManager(client);
    client.anischedule = new Anischedule(client);
    client.shoukaku = new ShoukakuHandler(client);
    client.queue = new Queue(client);
    client.collections = new Collections();
    let collection = [ 'xp', 'economy' ];
    for (const col of collection){
        client.collections.add(col);
    }
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
