const { join } = require('path');
const moment = require('moment');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));

module.exports = {
    name: 'setbirthday',
    aliases: [],
    description: 'Sets the profile birthday for your profile card.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'MANAGE_MESSAGES' ],
    category: 'Social',
    usage: '[date: DD-MM-YYYY]',
    run: async (client, message, [date]) => profile.findById(message.author.id, (err, doc) => {
  
        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new profile({ _id: message.author.id });
        }
  
        if (!date){
            return message.channel.send(`\\❌ **${message.author.tag}**, Please add the date`);
        } else {
            date = moment(date, 'DD-MM');
  
            if (!date.isValid()){
                return message.channel.send(`\\❌ **${message.author.tag}**, Please add the date in DD-MM-YYYY format`);
            }
  
            doc.data.profile.birthday = date.format('Do MMMM');
  
            return doc.save()
                .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, your birthday has been updated to **${date.format('Do MMMM')}**!`))
                .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, your birthday update failed!`));
        }
    })
};