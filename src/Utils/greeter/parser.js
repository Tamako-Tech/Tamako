const { MessageEmbed } = require('discord.js');
const _embed = require('./embed');


function error(message, options = {}){
    // options.type -> Error type
    // options.title -> The error title
    // options.subtitle -> The sub of the title
    // option.source -> The source url for the guide
    const embed = new MessageEmbed()
        .setColor('RED')
        .setFooter({ text: `${options.type} | ©️${new Date().getFullYear()} Tamako`})
        .setDescription([
            `❌\u2000\u2000|\u2000\u2000${options.title}\n\n`,
            options.subtitle ? options.subtitle + '\n' : '',
            `[**Learn More**](${options.source}) on how to configure Tamako's ${options.type} feature.`
        ].join(''));
    return message.channel.send({ embeds: [embed]});
}

function saveDocument(document, message, options = {}){
    return document.save()
        .then(() => {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setFooter({ text: `${options.type} | ©️${new Date().getFullYear()} Tamako`})
                .setDescription([
                    `<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000${options.title}\n\n`,
                    options.subtitle ? options.subtitle + '\n' : '',
                    `[**Learn More**](${options.source}) on how to configure Tamako's ${options.type} feature.`
                ].join('')); 
            return message.channel.send({ embeds: [embed]});
        });
}

function parseMessage(str, variables){
    const test = new RegExp(Object.keys(variables).map((k) => {
        return `(${k})`;
    }).join('|'), 'g');
    return str.replace(test, function(match){
        return variables[match];
    });
}

function checkStats(str){
    return str.match(/default|(msg|embed)=true|(msg|embed)=set|test/);
}

function embed(...args){
    return _embed(...args);
}

module.exports = {
    error, saveDocument, parseMessage, checkStats, embed
};