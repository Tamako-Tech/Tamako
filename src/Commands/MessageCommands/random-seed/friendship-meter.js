const { join } = require('path');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));
const { percentColor } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const percentColors = [
    { pct: 0.0, color: { r: 0, g: 0, b: 255 } },
    { pct: 0.5, color: { r: 0, g: 255 / 2, b: 255 / 2 } },
    { pct: 1.0, color: { r: 0, g: 255, b: 0 } }
];
module.exports = {
    name: 'friendship-meter',
    aliases: ['friendship-tester', 'friendship-test', 'friend-test'],
    description: 'Determines how good friends two users are.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Random-Seed',
    usage: '[user1] [user2]',
    run: async(client, message, [ first, second ], container) => {
        if (!first) return message.reply('You need to specify a user to test their friendship.');
        if(!validate(first,message)) return message.reply('Please provide a valid user.');
        second = second || message.author.id;
        if(!validate(second,message)) return message.reply('Please provide a valid user.');
        first = parse(first,message);
        second = parse(second,message);
        let level;
        const self = first.id === second.id;
        const owner = first.id.includes('397338324328775680') || second.id.includes('397338324328775680');
        const authorUser = first.id === message.author.id || second.id === message.author.id;
        const botUser = first.id === client.user.id || second.id === client.user.id;
        if (owner && botUser) {
            if (authorUser) level = 100;
            else level = 0;
        } else if (self) {
            level = 100;
        } else {
            const calculated = -Math.abs(Number.parseInt(BigInt(first.id) - BigInt(second.id), 10));
            const random = MersenneTwister19937.seed(calculated);
            level = integer(0, 100)(random);
        }
        const firstAvatarURL = first.displayAvatarURL({ format: 'png', size: 512 });
        const secondAvatarURL = second.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const firstAvatarData = await request.get(firstAvatarURL);
            const firstAvatar = await loadImage(firstAvatarData.body);
            const secondAvatarData = await request.get(secondAvatarURL);
            const secondAvatar = await loadImage(secondAvatarData.body);
            const base = await loadImage(join(__dirname, '../../../assets/images/friendship.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(firstAvatar, 70, 56, 400, 400);
            ctx.drawImage(secondAvatar, 730, 56, 400, 400);
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'green';
            ctx.font = '40px Pinky Cupid';
            ctx.fillText('~Tamako\'s Friendship Meter~', 600, 15);
            ctx.fillStyle = 'white';
            ctx.fillText(first.username, 270, 448);
            ctx.fillText(second.username, 930, 448);
            ctx.font = '60px Pinky Cupid';
            ctx.fillStyle = percentColor(level / 100, percentColors);
            ctx.fillText(`~${level}%~`, 600, 230);
            ctx.fillText(calculateLevelText(level, self, owner, authorUser, botUser), 600, 296);
            ctx.font = '90px Pinky Cupid';
            ctx.fillText(level > 49 ? '👍' : '👎', 600, 100);
            return message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'friendship.png' }] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }  
        
    }
};

function calculateLevelText(level, self, owner, authorUser, botUser) {
    if (owner && botUser) {
        if (authorUser) return 'Perfect';
        else return 'Yuck';
    }
    if (self) return 'Narcissist';
    if (level === 0) return 'Abysmal';
    if (level > 0 && level < 10) return 'Horrid';
    if (level > 9 && level < 20) return 'Awful';
    if (level > 19 && level < 30) return 'Very Bad';
    if (level > 29 && level < 40) return 'Bad';
    if (level > 39 && level < 50) return 'Poor';
    if (level > 49 && level < 60) return 'Average';
    if (level > 59 && level < 70) {
        if (level === 69) return 'Nice';
        return 'Fine';
    }
    if (level > 69 && level < 80) return 'Good';
    if (level > 79 && level < 90) return 'Great';
    if (level > 89 && level < 100) return 'Amazing';
    if (level === 100) return 'Besties';
    return '???';
}



/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
