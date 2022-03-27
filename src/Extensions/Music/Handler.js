require('dotenv').config();
const { Shoukaku, Libraries } = require('shoukaku');
const options = require('./options.js');
const servers = [{
    name: 'Tamako',
    url: process.env.LAVALINK_URL,
    auth: process.env.LAVALINK_PASSWORD,
}];
class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(new Libraries.DiscordJS(client), servers, options);
        this.on('ready',
            (name, resumed) =>
                console.log(`Lavalink Node: ${name} is now connected`, `This connection is ${resumed ? 'resumed' : 'a new connection'}`)
        );
        this.on('error',
            (name, error) =>
                console.log(error)
        );
        this.on('close',
            (name, code, reason) =>
                console.log(`Lavalink Node: ${name} closed with code ${code}`, reason || 'No reason')
        );
        this.on('disconnect',
            (name, players, moved) =>
                console.log(`Lavalink Node: ${name} disconnected`, moved ? 'players have been moved' : 'players have been disconnected')
        );
        this.on('debug',
            (name, reason) =>
                console.log(`Lavalink Node: ${name}`, reason || 'No reason')
        );
    }
}

module.exports = ShoukakuHandler;