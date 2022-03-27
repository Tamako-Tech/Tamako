const { join } = require('path');
const guilds = require(join(__dirname, '..', '..', '..', '..', 'Models', 'GuildProfile.js'));
const parser = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'greeter', 'parser.js'));
const errors = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'greeter', 'errors.js'));
const success = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'greeter', 'success.js'));

module.exports = {
    name: 'setgoodbyemsg',
    aliases: [ ],
    description: 'Set up the goodbye message. Supports Embeds! [Learn how to set up your Leaving Member Announcer](https://tamako.tech/docs/Setup/custom_leave_message)',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Setup',
    usage: '[options] [other parameters] Check the docs for more info.',
    run: async (client, message, [stats = '', ...args], container) => guilds.findById(message.guild.id, (err, doc) => {
        stats = stats.toLowerCase();
        const event = 'leaving';
        const profile = client.guildProfiles.get(message.guild.id);
        const type = 'Leaving Member Announcer';
        const source = 'https://tamako.tech/docs/Setup/custom_leave_message';
        const variables = {
            '%TYPE': 'goodbye',
            '%ACTION': 'leaves',
            '%PREFIX': container.Config.prefix[0],
            '%COMMAND': 'setgoodbyemsg',
            '%STATE': 'Outgoing',
            '%TITLE': 'Leaving Member Announcer'
        };
    
        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new guilds({ _id: message.guild.id });
        }
    
        if (!stats || !parser.checkStats(stats)){
            return parser.error(message, { type, source,
                title: errors.NO_OPTION_PARAM.title,
            });
        }
    
        //=========================================================//
        if (stats === 'default')
        {
            doc.greeter[event].type = 'default';
            return parser.saveDocument(doc, message, { type, source,
                title: parser.parseMessage(success.STATS_IS_DEF.title, variables),
                subtitle: parser.parseMessage(success.STATS_IS_DEF.subtitle, variables)
            }).then(() => {
                return profile.greeter[event].type = 'default';
            }).catch(() => {
                return sendError(message);
            });
        }
        else if (stats === 'msg=true')
        {
            if (!doc.greeter[event].message){
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.NO_TEXT_MESSAGE.title, variables),
                    subtitle: parser.parseMessage(errors.NO_TEXT_MESSAGE.subtitle, variables)
                });
            } else {
                doc.greeter[event].type = 'msg';
                return parser.saveDocument(doc, message, { type, source,
                    title: parser.parseMessage(success.TYPE_IS_MESSAGE.title, variables),
                    subtitle: parser.parseMessage(success.TYPE_IS_MESSAGE.title, variables)
                }).then(() => {
                    return profile.greeter[event].type = 'msg';
                }).catch(() => {
                    return sendError(message);
                });
            }
        }
        else if (stats === 'embed=true')
        {
            if (!doc.greeter[event].embed || !Object.entries(doc.greeter[event].embed).length){
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.NO_EMBED.title, variables),
                    subtitle: parser.parseMessage(errors.NO_EMBED.subtitle, variables)
                });
            } else {
                doc.greeter[event].type = 'embed';
                return parser.saveDocument(doc, message, { type, source,
                    title: parser.parseMessage(success.TYPE_IS_EMBED.title, variables),
                    subtitle: parser.parseMessage(success.TYPE_IS_EMBED.subtitle, variables)
                }).then(() => {
                    return profile.greeter[event].type = 'embed';
                }).catch(() => {
                    return sendError(message);
                });
            }
        }
        else if (stats === 'msg=set')
        {
            if (!args.length){
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.MESSAGE_SET_NO_ARGS.title, variables),
                    subtitle: parser.parseMessage(errors.MESSAGE_SET_NO_ARGS.subtitle, variables)
                });
            } else {
                doc.greeter[event].message = args.join(' ');
                return parser.saveDocument(doc, message, { type, source,
                    title: parser.parseMessage(success.MESSAGE_TEXT_SET.title, variables),
                    subtitle: parser.parseMessage(success.MESSAGE_TEXT_SET.subtitle, variables),
                }).then(() => {
                    return profile.greeter[event].message = args.join(' ');
                })
                    .catch(() => {
                        return sendError(message);
                    });
            }
        }
        else if (stats === 'embed=set')
        {
            if (!args.length){
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.EMBED_SET_NO_ARGS.title, variables),
                    subtitle: parser.parseMessage(errors.EMBED_SET_NO_ARGS.subtitle, variables)
                });
            } else {
                const status = parser.embed(args, doc.greeter[event].embed || {});
    
                if (status.error){
                    return parser.error(message, { type, source,
                        title: parser.parseMessage(errors[status.error].title, variables),
                        subtitle: parser.parseMessage(errors[status.error].subtitle || status.fails.map(x => `\\⚠️ ${x}`).join('\n'), variables)
                    });
                }
    
                doc.greeter[event].embed = status.embed;
                return parser.saveDocument(doc, message, { type, source,
                    title: parser.parseMessage(success.MESSAGE_EMBED_SET.title, variables),
                    subtitle: [
                        status.success.map(x => `\\✔️ ${x}`).join('\n'),
                        status.fails.map(x => `\\⚠️ ${x}`).join('\n'),
                        parser.parseMessage(success.MESSAGE_EMBED_SET.subtitle, variables)
                    ].join('\n')
                }).then(() => {
                    return profile.greeter[event].embed = status.embed;
                }).catch(() => {
                    return sendError(message);
                });
            }
        }
        else
        {
            if (!profile.greeter[event].isEnabled)
            {
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.FEATURE_NOT_ENABLED.title, variables),
                    subtitle: parser.parseMessage(errors.FEATURE_NOT_ENABLED.subtitle, variables)
                });
            }
            else if (!message.guild.channels.cache.get(profile.greeter[event].channel))
            {
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.CHANNEL_NOT_FOUND.title, variables),
                    subtitle: parser.parseMessage(errors.CHANNEL_NOT_FOUND.subtitle, variables)
                });
            }
            else if (!profile.greeter[event].type)
            {
                return parser.error(message, { type, source,
                    title: parser.parseMessage(errors.NO_TYPE.title, variables),
                    subtitle: parser.parseMessage(errors.NO_TYPE.subtitle, variables)
                });
            }
            else if (stats === 'test')
            {
                message.react('✅');
                return client.emit('guildMemberRemove', message.member);
            } else {
                return message.channel.send(`\\❌ | **${message.author.tag}**, \`[${stats}]\` is not a valid option!`);
            }
        }
    })
};
    
function sendError(message){
    return message.channel.send('\\❌ [DATABASE_ERR]:` Unable to save the document to the database, please try again later!');
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */