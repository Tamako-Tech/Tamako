const request = require('node-superfetch');
const moment = require('moment');
const { join } = require('path');
const { base64 } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'frinkiac',
    aliases: ['the-simpsons', 'simpsons', 'simpson'],
    description: 'Input a line from the Simpsons to get the episode/season.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '<line>',
    run: async (client, message, [ ...query ], container) => {
        if (!query) return message.reply('You must provide a query!');
        query = query.join(' ');
        try {
            const search = await searchs(query);
            if (!search) return message.reply('Could not find any results.');
            const data = await fetchCaption(search.Episode, search.Timestamp);
            const time = moment.duration(data.Frame.Timestamp).format();
            const caption = data.Subtitles.map(sub => sub.Content).join(' ').split(' ');
            let url = `https://frinkiac.com/meme/${data.Frame.Episode}/${data.Frame.Timestamp}.jpg`;
            const wrapped = [''];
            let currentLine = 0;
            for (const word of caption) {
                if (wrapped[currentLine].length + word.length < 26) {
                    wrapped[currentLine] += ` ${word}`;
                } else {
                    wrapped.push(` ${word}`);
                    currentLine++;
                }
            }
            url += `?b64lines=${base64(wrapped.join('\n'))}`;
            const seasonEpisode = `S${data.Episode.Season}E${data.Episode.EpisodeNumber}`;
            return message.reply(
                `This is from **${seasonEpisode} ("${data.Episode.Title}") @ ${time}**.`,
                { files: [url] }
            );
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }  
        
    }
};

async function searchs(query) {
    const { body } = await request
        .get('https://frinkiac.com/api/search')
        .query({ q: query });
    if (!body.length) return null;
    return body[0];
}

async function fetchCaption(ep, ts) {
    const { body } = await request
        .get('https://frinkiac.com/api/caption')
        .query({
            e: ep,
            t: ts
        });
    return body;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
