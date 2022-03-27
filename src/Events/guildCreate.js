// to do

const { join } = require('path');
const guilds = require(join(__dirname, '..', 'Models', 'GuildProfile.js'));
const text = require(join(__dirname, '..', 'Utils', 'utilities.js'));
module.exports = {
    name: 'guildCreate',
    run: async(guild, client) => guilds.findById(guild.id, async (err, doc) => {
        
        /*===============WELCOME TO THE GUILD_CREATE EVENT=============
          This function runs everytime the bot receives any guild payload
          from discord after the ready event is fired.
        =============================================================*/
      
        /*=====================================================
           Declare variables
        =====================================================*/
        const owner = await client.users.fetch(guild.ownerID)
            .then(owner => owner.tag)
            .catch(() => '<Unfetched Data>');
      
        const logo = '<:Enter:794918219835637760>';
        const members = text.commatize(guild.memberCount);
        const message = `${logo} : **${members}** members, owned by **${owner}**`;
        //====================================================//
      
      
        /*======================================================
           Check the validity of database connection and save
           new guild profile.
        ======================================================*/
        if (err){
            console.log(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else {
            if (!doc){
                doc = await new guilds({ _id: guild.id }).save();
            }
            client.guildProfiles.set(guild.id, doc);
        }
        //====================================================//
      
      
    
        //=====================================================//
      
        // add more functions on message guildCreate callback function...
      
        return;
    })
};
