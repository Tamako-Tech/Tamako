const { randomQuote } = require('animequotes');
const { searchAnime } = require('node-kitsu');

module.exports = {
    name: 'aniquote',
    aliases: [ 'aq', 'animequote' ],
    description: 'Generate a random anime quote',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Search',
    usage: '[Channel ID/Mention]',
    run: async ( client, message, args, container) => {
        try {
            
            const { quote, anime, id, name } = randomQuote();

            const res = await searchAnime(anime,0).catch(()=>{}) || [];

            const image = res?.[0]?.attributes?.coverImage?.original || null;
            return message.channel.send({ embeds: [
                new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .addField(`*Quoted from ${anime}* (id: ${id})`,`${quote}\n\n-*${name}*`)
                    .setImage(image)
                    .setTimestamp()
                    .setFooter({text: `Anime Quotes | ©️${new Date().getFullYear()} Tamako`})
            ]});
        } catch (err) {
            console.log(err);
            return message.channel.send('\\❌ Something went wrong. Please try again later.');
        }
    }
};