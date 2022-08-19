const { join } = require('path')
const Dispatcher = require(join(__dirname, 'Dispatcher'));

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }

    async handle(guild, member, channel, node, track) {
        const existing = this.get(guild.id);
        if (!existing) {
            if (this.client.shoukaku.players.has(guild.id)) 
                return 'Busy';
            const player = await node.joinChannel({
                guildId: guild.id,
                shardId: guild.shardId,
                channelId: member.voice.channelId
            });
            console.log(player.constructor.name, `New connection @ guild "${guild.id}"`);
            const dispatcher = new Dispatcher({
                client: this.client,
                guild,
                channel,
                player
            });
            dispatcher.queue.push(track);
            this.set(guild.id, dispatcher);
            console.log(dispatcher.constructor.name, `New player dispatcher @ guild "${guild.id}"`);
            return dispatcher;
        }
        existing.queue.push(track);
        if (!existing.current) existing.play();
        return null;
    }
}
module.exports = Queue;