const { decode } = require('he');
const { join } = require('path');
const userquery  = require('require-text')(join(__dirname, '..', '..', '..', '..', 'assets', 'graphql', 'User.graphql'), require);
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'alprofile',
    aliases: [ 'al-of', 'alof', 'alstat', 'aluser' ],
    description: 'Finds user profile on Anilist based on the provided query',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Search',
    usage: '[Channel ID/Mention]',
    run: async ( client, message, args, container ) => {
        try {
            
            const query = args.join(' ');
    
            if (!query){
                return message.channel.send('\\❌ Please include the user to find on Anilist!');
            }
    
            const response = await client.anischedule.fetch(userquery, { search: query });
    
            if (response.errors){
                let err;
                if (response.errors[0].status === 404){
                    err = `\\❌ I can't find **${query}** on Anilist!`;
                } else if (response.errors.some(x => x.status >= 500)){
                    err = `\\❌ Anilist couldn't be reached at the moment! Please try again later. [err ${response.errors[0].status}]`;
                } else if (response.errors.some(x => x.status >= 400)){
                    err ='`❌ CLIENT_ERR`: Tamako attempted to send an invalidated request to AniList. Please contact my developer to fix this bug.';
                } else {
                    err = '\\❌ Something wrong has occured. Please try again later';
                }
                return message.channel.send(err);
            }
    
            return message.channel.send({ embeds: [
                new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .setImage(response.data.User.bannerImage)
                    .setThumbnail(response.data.User.avatar.medium)
                    .setAuthor({ name: response.data.User.name, iconURL: null, url: response.data.User.siteUrl })
                    .setDescription(text.truncate(decode(response.data.User.about?.replace(/(<([^>]+)>)/ig,'') || ''), 250))
                    .setFooter({text: `ALProfile | ©️${new Date().getFullYear()} Tamako`})
                    .addFields(Object.entries(response.data.User.favourites).map(([topic, target]) => {
                        topic = topic.charAt(0).toUpperCase() + topic.slice(1);
                        return {
                            name: `Top 5 ${topic}${'\u2000'.repeat(12-topic.length)}\u200b` , inline: true,
                            value: target.edges.map(entry => {
                                const identifier = entry.node.title || entry.node.name;
                                const name = typeof identifier === 'object' ? identifier.userPreferred || identifier.full : identifier;
    
                                return `• [**${name}**](${entry.node.siteUrl})`;
                            }).join('\n') || 'None Listed'
                        };
                    }))
            ]});
        } catch (err) {
            console.log(err);
            return message.channel.send('\\❌ Something went wrong. Please try again later.');
        }
    }
};