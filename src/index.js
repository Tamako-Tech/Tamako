require('dotenv').config()
const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js')
const { join } = require('path')
const config = require(join(__dirname, 'config', 'config.json'))
const logger = require(join(__dirname, 'handlers', 'logger'))
const ShoukakuHandler = require(join(__dirname, 'Extensions', 'Music', 'Handler.js'))
const Queue = require(join(__dirname, 'Extensions', 'Music', 'Queue.js'))

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: 'with the bot',
      type: 0
    }],
    status: 'dnd'
  }
})

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN
if (!AuthenticationToken) {
  logger.error('CRITICAL', 'No token found in config.json or environment variables')
  process.exit()
};

// Handler:
client.commands = new Collection()
client.commands.alias = new Collection()
client.slashcmds = new Collection()
client.events = new Collection()
client.shoukaku = new ShoukakuHandler(client)
client.queue = new Queue(client)

module.exports = client;

['prefix', 'slash', 'events', 'mongoose'].forEach(file => {
  require(`./handlers/${file}`)(client)
})

// Login to the bot:
client.login(AuthenticationToken)
  .catch((err) => {
    logger.error('CRITICAL', 'Error from discord API', err)
    process.exit()
  })

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  logger.error('ANTI CRASH', 'Unhandled Rejection', err)
  console.error(promise)
})
