const { readdirSync  } = require('fs');
const { registerFont } = require('canvas');
const { join } = require('path');
const filterfonttypes  = x => ['ttf', 'otf'].includes(x.split('.').pop());

for (const fontFileName of readdirSync(join(__dirname, 'assets/fonts')).filter(filterfonttypes)){
    const [ family, weight ] = fontFileName.split(/\.(t|o)tf/)[0].split(' ');
    registerFont(join(__dirname, 'assets/fonts', fontFileName), { family: family.split('-').join(' '), weight: weight?.toLowerCase() });
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
