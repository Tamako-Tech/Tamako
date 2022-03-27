const _ = require('lodash');
const { join } = require('path');
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));
const Pages = require(join(__dirname, '..', '..', '..', '..', 'Extensions', 'Paginate.js'));
const market = require(join(__dirname, '..', '..', '..', '..', 'assets', 'json', 'market.json'));

module.exports = {
    name: 'market',
    aliases: [],
    description: 'Check what you can buy from the shop.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, [type], container) => {

        let selected = market.filter(x => x.type === type?.toLowerCase());

        if (!selected.length){
            selected = market;
        }

        const pages = new Pages(_.chunk(selected, 24).map((chunk, i, o) => {
            return new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setTitle('Tamako Market')
                .setDescription('You can view all the items at [Tamako Market](https://market.tamako.tech/)')
                .setFooter({text: `Market | ©️${new Date().getFullYear()} Tamako\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`})
                .addFields(...chunk.map(item => {
                    return {
                        inline: true,
                        name: `\`[${item.id}]\` ${item.name}`,
                        value: [
                            item.description,
                            `Type: *${item.type}*`,
                            `Price: *${text.commatize(item.price)}*`,
                            `Check Preview : \`${container.Config.prefix[0]}previewitem ${item.id}\``,
                            `Purchase: \`${container.Config.prefix[0]}buy ${item.id} [amount]\``
                        ].join('\n')
                    };
                }));
        }));
        const msg = await message.channel.send({ embeds: [pages.firstPage]});

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
    }
};


/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */