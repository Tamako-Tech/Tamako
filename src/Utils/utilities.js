const { decode: decodeHTML } = require('html-entities');

function list(arr, conj = 'and') {
    const len = arr.length;
    if (len === 0) return '';
    if (len === 1) return arr[0];
    return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
}

function firstUpperCase(text, split = ' ') {
    return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) return null;
    return ((r << 16) | (g << 8) | b).toString(16);
}

function base64(text, mode = 'encode') {
    if (mode === 'encode') return Buffer.from(text).toString('base64');
    if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
    throw new TypeError(`${mode} is not a supported base64 mode.`);
}

function shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
}

function formatNumber(number, minimumFractionDigits = 0) {
    return Number.parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits,
        maximumFractionDigits: 2
    });
}

function today(timeZone) {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
    return now;
}

function tomorrow(timeZone) {
    const today = today(timeZone);
    today.setDate(today.getDate() + 1);
    return today;
}


function isLeap(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function embedURL(title, uri, display) {
    return `[${title}](${uri.replaceAll(')', '%29')}${display ? ` "${display}"` : ''})`;
}

function percentColor(pct, percentColors) {
    let i = 1;
    for (i; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
        r: Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper)).toString(16).padStart(2, '0'),
        g: Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper)).toString(16).padStart(2, '0'),
        b: Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper)).toString(16).padStart(2, '0')
    };
    return `#${color.r}${color.g}${color.b}`;
}

function cleanAnilistHTML(html, removeLineBreaks = true) {
    let clean = html;
    if (removeLineBreaks) clean = clean.replace(/\r|\n|\f/g, '');
    clean = decodeHTML(clean);
    clean = clean
        .replaceAll('<br>', '\n')
        .replace(/<\/?(i|em)>/g, '*')
        .replace(/<\/?b>/g, '**')
        .replace(/~!|!~/g, '||');
    if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
    const spoilers = (clean.match(/\|\|/g) || []).length;
    if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += '||';
    return clean;
}

function trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} more...`);
    }
    return arr;
}

function timeZoneConvert (data) {
    var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date1 = new Date(data);
    let date = date1.getDate();
    let year = date1.getFullYear();
    let month = months[date1.getMonth() + 1];
    let h = date1.getHours();
    let m = date1.getMinutes();
    let ampm = 'AM';
    if(m < 10) {
        m = '0' + m;
    }
    if(h > 12) {
        h = h - 12;
        let ampm = 'PM';
    }
    return month + ' ' + date + ', ' + year + ' ' + h + ':' + m + ' ' + ampm;
}

module.exports = {
    list,
    firstUpperCase,
    rgbToHex,
    base64,
    shorten,
    formatNumber,
    today,
    tomorrow,
    isLeap,
    embedURL,
    percentColor,
    cleanAnilistHTML,
    trimArray,
    timeZoneConvert
};