const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { MersenneTwister19937, bool } = require('random-js');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '../../../Functions/types/user'));
const { streamToArray } = require(join(__dirname, '../../../Functions/canvas'));

module.exports = {
    name: 'eject',
    aliases: [ ],
    description: 'AmogSus Imposter',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Avatar',
    usage: '[user] [Is user an imposter? (true/false)]',
    run: async (client, message, [ user, imposter = '' ], Discord) => {
        user = user || message.author.id;
        if (!validate(user, message)) return message.reply(`${message.author} That is not a valid user.`);
        user = parse(user, message);
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const { body } = await request.get(avatarURL);
            const avatar = await loadImage(body);
            if (imposter === '') {
                const random = MersenneTwister19937.seed(user.id);
                imposter = bool()(random);
            }
            if (imposter === 'true' || imposter === 't' || imposter === 'yes' || imposter === 'y' || imposter === 'on' || imposter === 'enable' || imposter === 'enabled' || imposter === '1' || imposter === '+') {
                imposter = 1;
            } else {
                imposter = 0;
            }
            const text = `${user.username} was${imposter ? ' ' : ' not '}An Imposter.`;
            const encoder = new GIFEncoder(320, 180);
            const canvas = createCanvas(320, 180);
            const ctx = canvas.getContext('2d');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = '18px Noto Regular';
            const stream = encoder.createReadStream();
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(100);
            encoder.setQuality(200);
            for (let i = 0; i < 52; i++) {
                const frameID = `frame_${i.toString().padStart(2, '0')}.gif`;
                const frame = await loadImage(join(__dirname, '../', '../', '../', 'assets', 'images', 'eject', frameID));
                ctx.drawImage(frame, 0, 0);
                if (i <= 17) {
                    const x = ((320 / 15) * i) - 50;
                    const y = (frame.height / 2) - 25;
                    const rotation = (360 / 15) * i;
                    const angle = rotation * (Math.PI / 180);
                    const originX = x + 25;
                    const originY = y + 25;
                    ctx.translate(originX, originY);
                    ctx.rotate(-angle);
                    ctx.translate(-originX, -originY);
                    ctx.drawImage(avatar, x, y, 50, 50);
                    ctx.translate(originX, originY);
                    ctx.rotate(angle);
                    ctx.translate(-originX, -originY);
                }
                if (i > 17) {
                    if (i <= 27) {
                        const letters = Math.ceil(((text.length / 10) * (i - 17)) + 1);
                        const toDraw = text.slice(0, letters + 1);
                        ctx.fillText(toDraw, frame.width / 2, frame.height / 2, 300);
                    } else {
                        ctx.fillText(text, frame.width / 2, frame.height / 2, 300);
                    }
                }
                encoder.addFrame(ctx);
            }
            encoder.finish();
            const buffer = await streamToArray(stream);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(text)
                .setImage('attachment://eject.gif')
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
            return message.reply({ files: [{ attachment: Buffer.concat(buffer), name: 'eject.gif' }], embeds: [embed] });
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
