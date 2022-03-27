const _ = require('lodash');
const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const Pages = require(join(__dirname, '..', '..', '..', '..', 'Extensions', 'Paginate.js'));
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));

module.exports = {
    name: 'inventory',
    aliases: [ ],
    description: 'Check Your Inventory',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => profile.findById(message.author.id, async (err, doc) => {

        try {
            if (err){
                return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
            } else if (!doc){
                doc = new profile({ _id: message.author.id });
            }
    
            const pages = new Pages(_.chunk(doc.data.profile.inventory, 25).map((chunk, i, o) => {
                return new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .setTitle(`${message.author.tag}'s Inventory`)
                    .setDescription('[ WIP ]')
                    .setFooter(`Market | ©️${new Date().getFullYear()} Tamako\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`)
                    .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
                        const item = market.find(x => x.id == d.id);
                        return {
                            inline: true,
                            name: `\`[${item.id}]\` x${d.amount} ${item.name}`,
                            value: [
                                `Type: *${item.type}*`,
                                `Selling Price: *${Math.floor(item.price * 0.7)}*`,
                                `Use: \`${container.Config.prefix[0]}use ${item.id}\``,
                                `Sell: \`${container.Config.prefix[0]}sell ${item.id} [amount]\``
                            ].join('\n')
                        };
                    }));
            }));
    
            if (!pages.size){
                return message.channel.send(`\\❌ **${message.author.tag}**, your inventory is empty.`);
            }
    
            const msg = await message.channel.send({embeds: [pages.firstPage]});
    
            if (pages.size === 1){
                return;
            }
    
            const prev = '◀';
            const next = '▶';
            const terminate = '❌';
    
            const filter = (reaction, user) => {
                return reaction.emoji.name && user.id === message.author.id;
            };
            const collector = msg.createReactionCollector({ filter, time: 90000 });
            const navigators = [ prev, next, terminate ];
            let timeout = setTimeout(()=> collector.stop(), 90000);
    
            for (let i = 0; i < navigators.length; i++) {
                await msg.react(navigators[i]);
            }
     
            collector.on('collect', async (reaction) => {
                switch(reaction.emoji.name){
                case prev:
                    msg.edit({embeds: [pages.previous()]});
                    break;
                case next:
                    msg.edit({embeds: [pages.next()]});
                    break;
                case terminate:
                    collector.stop();
                    break;
                }
                await reaction.users.remove(message.author.id);
                timeout.refresh();
    
            });
        
            collector.on('end', async () => await msg.reactions.removeAll());
            return; 
        } catch (err) {
            console.log(err);
            return message.channel.send(`\`❌ ERROR:\` ${err}`);
        }


    })
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */