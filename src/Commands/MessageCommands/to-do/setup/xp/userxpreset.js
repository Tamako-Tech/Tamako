const { join } = require('path');
const profile = require(join(__dirname,'..', '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'userxpreset',
    aliases: ['resetuserxp','resetxpuser'],
    description: 'Reset the xp of a particular user in this server.',
    ownerOnly: false,
    dbRequired: true,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '',
    run: async (client, message,) =>  {

        const match = message.content.match(/\d{17,19}/)?.[0] || ' ';

        if (!match){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please mention the user whose xp needs resetting.`);
        }

        const member = await message.guild.members.fetch(match).catch(() => {});

        if (!member){
            return message.channel.send(`\\❌ **${message.author.tag}**, Couldn't find that member in this server!`);
        } else if (member.user.bot){
            return message.channel.send(`\\❌ **${message.author.tag}**, A bot cannot earn experience points!`);
        }

        await message.channel.send(`This will **reset** **${member.displayName}**'s experience points in this server (Action irreversible). Continue?`);

        const msg_filter = (m) => m.author.id === message.author.id;

        const continued = await message.channel.awaitMessages({ filter: msg_filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
            .catch(() => false);

        if (!continued){
            return message.channel.send(`\\❌ **${message.author.tag}**, cancelled the userxpreset command!`);
        }
        return profile.findById(member.id, (err, doc) => {
            if (err){
                return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
            } else if (!doc){
                return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** has not started earning xp!`);
            }
        
            const index = doc.data.xp.findIndex(x => x.id === message.guild.id);
        
            if (index < 0){
                return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** has not started earning xp!`);
            }
        
            doc.data.xp.splice(index, 1);
        
            return doc.save()
                .then(() => message.channel.send(`\\✔️ **${member.user.tag}**'s Experience Points has been sucessfully reset!`))
                .catch(() => message.channel.send(`\\❌ **${member.user.tag}**'s Experience Points reset attempt failed!`));
        });
        
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */