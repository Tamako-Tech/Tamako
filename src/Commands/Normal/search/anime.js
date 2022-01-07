const { join } = require('path');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { embedURL, cleanAnilistHTML } = require(join(__dirname, '../../../Functions/Utils'));
const searchGraphQL = stripIndents`
	query ($search: String, $type: MediaType, $isAdult: Boolean) {
		anime: Page (perPage: 10) {
			results: media (type: $type, isAdult: $isAdult, search: $search) {
				id
				title {
					english
					romaji
				}
			}
		}
	}
`;
const resultGraphQL = stripIndents`
	query media($id: Int, $type: MediaType) {
		Media(id: $id, type: $type) {
			id
			idMal
			title {
				english
				romaji
			}
			coverImage {
				large
				medium
			}
			startDate { year }
			description(asHtml: false)
			season
			type
			siteUrl
			status
			episodes
			isAdult
			meanScore
			averageScore
			externalLinks {
				url
				site
			}
		}
	}
`;
const seasons = {
    WINTER: 'Winter',
    SPRING: 'Spring',
    SUMMER: 'Summer',
    FALL: 'Fall'
};
const statuses = {
    FINISHED: 'Finished',
    RELEASING: 'Releasing',
    NOT_YET_RELEASED: 'Unreleased',
    CANCELLED: 'Cancelled'
};

module.exports = {
    name: 'anime',
    aliases: ['anilist-anime', 'anilist', 'ani', 'myanimelist', 'mal-score'],
    description: 'Searches AniList for your query, getting anime results.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[name]',
    run: async (client, message, [ ...query ], Discord) => {
        if (!query) return message.channel.send('You must provide a query!');
        query = query.join(' ');
        try {
            const id = await search(query.join(' '));
            if (!id) return message.reply('Could not find any results.');
            const anime = await fetchAnime(id);
            const malScore = await fetchMALScore(anime.idMal);
            const malURL = `https://myanimelist.net/anime/${anime.idMal}`;
            const embed = new Discord.MessageEmbed()
                .setColor(0x02A9FF)
                .setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
                .setURL(anime.siteUrl)
                .setThumbnail(anime.coverImage.large || anime.coverImage.medium || null)
                .setTitle(anime.title.english || anime.title.romaji)
                .setDescription(anime.description ? cleanAnilistHTML(anime.description) : 'No description.')
                .addFields(
                    { name: '❯ Status', value: `${statuses[anime.status]}` || 'Unknown', inline: true },
                    { name: '❯ Episodes', value: `${anime.episodes}` || '???', inline: true },
                    { name: '❯ Season', value: anime.season ? `${seasons[anime.season]} ${anime.startDate.year}` : '???', inline: true },
                    { name: '❯ Average Score', value: anime.averageScore ? `${anime.averageScore}%` : '???', inline: true },
                    { name: '❯ MAL Score', value: malScore ? embedURL(malScore, malURL) : '???', inline: true },
                    {
                        name: '❯ External Links',
                        value: anime.externalLinks.length ? anime.externalLinks.map(link => `[${link.site}](${link.url})`).join(', ') : 'None'
                    }
                )
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }

};

async function search(query) {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: {
                search: query,
                type: 'ANIME'
            },
            query: searchGraphQL
        });
    if (!body.data.anime.results.length) return null;
    return body.data.anime.results[0].id;
}

async function fetchAnime(id) {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: {
                id,
                type: 'ANIME'
            },
            query: resultGraphQL
        });
    return body.data.Media;
}

async function fetchMALScore(id) {
    try {
        const { text } = await request.get(`https://myanimelist.net/anime/${id}`);
        const $ = cheerio.load(text);
        return $('span[itemprop="ratingValue"]').first().text();
    } catch {
        return null;
    }
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
