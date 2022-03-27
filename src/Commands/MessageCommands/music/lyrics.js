const fetch = require('node-fetch');
const { join } = require('path');
const Page = require(join(__dirname, '..', '..', '..', 'Extensions', 'Paginate.js'));

module.exports = {
    name: 'lyrics',
    aliases: [],
    description: 'Searches for lyric info about a song from Genius Lyrics or the currently playing music',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Music',
    usage: '',
    run: async (client, message, args, container) => {
        
        try {
            let query;
            query = args.join(' ') || 'Cheating on you';
            const dispatcher = client.queue.get(message.guild.id);
            if (dispatcher !== undefined) query = args.join(' ') || dispatcher.current.info.title;

            const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(query)}`)
                .then(res => res.json())
                .catch(() => null);
        
            if (!data || data.error){
                return message.channel.send(`\\❌ | ${message.author}, I couldn't find the lyrics for ${args.join(' ')}!`);
            }

            if (data.lyrics.length < 2000){
                return message.channel.send({ embeds: [
                    new container.Discord.MessageEmbed()
                        .setColor('GREY')
                        .setDescription(data.lyrics)
                        .setThumbnail(data.thumbnail.genius)
                        .setFooter(`Lyrics | ©️${new Date().getFullYear()} Mai`)
                        .setAuthor({name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius})
                ]});
            }
          
            const lyrics_array = data.lyrics.split('\n');
            const lyrics_subarray = [ '' ];
            let n = 0;
          
            for (const line of lyrics_array){
                if (lyrics_subarray[n].length + line.length < 2000){
                    lyrics_subarray[n] = lyrics_subarray[n] + line + '\n';
                } else {
                    n++;
                    lyrics_subarray.push(line);
                }
            }
          
            const pages = new Page(
                lyrics_subarray.map((x,i) =>
                    new container.Discord.MessageEmbed()
                        .setColor('GREY')
                        .setDescription(x)
                        .setThumbnail(data.thumbnail.genius)
                        .setFooter([
                            `Page ${i+1} of ${lyrics_subarray.length}`,
                            `Lyrics | ©️${new Date().getFullYear()} Mai`
                        ].join( '\u2000•\u2000' ))
                        .setAuthor({name: `${data.title}\n${data.author}`, iconURL: null, url: data.links.genius})
                )
            );
          
            const msg = await message.channel.send({embeds: [pages.currentPage]});


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

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }  
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */