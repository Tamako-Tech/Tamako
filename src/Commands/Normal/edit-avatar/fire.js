const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { streamToArray, drawImageWithTint } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'fire',
    aliases: [ ],
    description: 'Burns a user\'s avatar.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user]',
    run : async(client, message, [ user ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} You must provide a valid user.`);
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            const encoder = new GIFEncoder(avatar.width, avatar.height);
            const canvas = createCanvas(avatar.width, avatar.height);
            const ctx = canvas.getContext('2d');
            const stream = encoder.createReadStream();
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(100);
            encoder.setQuality(200);
            for (let i = 0; i < 31; i += 2) {
                const frameID = `frame-${i.toString().padStart(2, '0')}.png`;
                const frame = await loadImage(join(__dirname, '../', '../', '../', 'assets', 'images', 'fire', frameID));
                const ratio = frame.width / frame.height;
                const height = Math.round(avatar.width / ratio);
                drawImageWithTint(ctx, avatar, '#fc671e', 0, 0, avatar.width, avatar.height);
                ctx.drawImage(frame, 0, avatar.height - height, avatar.width, height);
                encoder.addFrame(ctx);
            }
            encoder.finish();
            const buffer = await streamToArray(stream);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription('Let There Be Fire!')
                .setImage('attachment://fire.gif')
                .setFooter({ text: `Avatar manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ files: [{ attachment: Buffer.concat(buffer), name: 'fire.gif' }], embeds: [embed] });
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
