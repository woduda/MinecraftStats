// Number formatter
intlFormat = new Intl.NumberFormat('en');

formatFloat = function(value) {
    return (value != parseInt(value)) ? value.toFixed(1) : value;
};

formatDate = function(unixTime) {
    var date = new Date();
    date.setTime(unixTime * 1000);

    return date.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'});
};

formatTime = function(unixTime) {
    var date = new Date();
    date.setTime(unixTime * 1000);

    return date.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}) +
        ' - ' +
        date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});
};

wordSmallInt = function(x) {
    switch(x) {
        case 0:  return 'zero';
        case 1:  return 'one';
        case 2:  return 'two';
        case 3:  return 'three';
        case 4:  return 'four';
        case 5:  return 'five';
        case 6:  return 'six';
        case 7:  return 'seven';
        case 8:  return 'eight';
        case 9:  return 'nine';
        case 10:  return 'ten';
        case 11:  return 'eleven';
        case 12:  return 'twelve';
        default: return ''+x;
    }
};

// Format an award value
mcstats.formatValue = function(value, unit, compact = false) {
    switch(unit) {
        case 'cm':
            if(value >= 100000) {
                value /= 100000;
                unit = 'km';
            } else if(value >= 100) {
                value /= 100;
                unit = 'm';
            }

            value = formatFloat(value) + unit;
            break;

        case 'ticks':
            seconds = value / 20; // ticks per second
            if(compact) {
                // small text-based view
                value = '';
                var higher = false;

                if(seconds > 86400) {
                    value += Math.floor(seconds / 86400) + 'd ';
                    seconds %= 86400;
                    higher = true;
                }

                if(higher || seconds > 3600) {
                    value += Math.floor(seconds / 3600) + 'h ';
                    seconds %= 3600;
                    higher = true;
                }

                if(higher || seconds > 60) {
                    value += Math.floor(seconds / 60) + 'min ';
                    seconds %= 60;
                }

                value += Math.floor(seconds) + 's';
            } else {
                // aligned tabular view
                var table = `<table class="time-data"><tbody><tr>`
                var higher = false;

                if(seconds > 86400) {
                    var days = Math.floor(seconds / 86400);
                    table += `<td class="days">${days}d</td>`

                    seconds %= 86400;
                    higher = true;
                } else {
                    table += `<td class="days"></td>`
                }

                if(higher || seconds > 3600) {
                    var hours = Math.floor(seconds / 3600);
                    table += `<td class="hours">${hours}h</td>`
                    seconds %= 3600;
                    higher = true;
                } else {
                    table += `<td class="hours"></td>`
                }

                if(higher || seconds > 60) {
                    var minutes = Math.floor(seconds / 60);
                    table += `<td class="minutes">${minutes}min</td>`

                    seconds %= 60;
                } else {
                    table += `<td class="minutes"></td>`
                }

                seconds = Math.floor(seconds);
                table += `<td class="seconds">${seconds}s</td>`;
                table += `</tbody></table>`;
                return table;
            }
            break;

        case 'int':
            value = intlFormat.format(parseInt(value));
            break;

        default:
            value = '' + value + ' ' + unit;
            break;
    }

    return `<span class="text-data">${value}</span>`;
};

// Award types
mcstats.awardType = {
    medal: {title: 'Medal', imgPrefix: 'fatcow/medal_award_'},
    crown: {title: 'Crown', imgPrefix: 'fatcow/crown_'},
};

// Create a rank widget
mcstats.rankWidget = function(rank, type = 'medal') {
    var awardType = mcstats.awardType[type];
    if(rank) {
        var widget = `<span class="rank rank-${rank}">#${rank}</span>`;
        var medal, medalTitle;
        switch(rank) {
            case 1:
                // gold
                medal = 'gold';
                medalTitle = 'Gold';
                break;

            case 2:
                // silver
                medal = 'silver';
                medalTitle = 'Silver';
                break;

            case 3:
                // bronze
                medal = 'bronze';
                medalTitle = 'Bronze';
                break;

            default:
                medal = false;
        }

        if(medal) {
            widget = `
                <img class="img-textsize-1_5 mr-1 align-top" title="${medalTitle} ${awardType.title}" src="img/${awardType.imgPrefix}${medal}.png"/>
            ` + widget;
        }
    } else {
        widget = `<span class="rank">-</span>`;
    }
    return widget;
};

// Test whether a timestamp is within the "active" threshold
mcstats.isActive = function(last) {
    var daysSinceLast = (mcstats.info.updateTime - last) / 86400;
    return (daysSinceLast <= mcstats.info.inactiveDays);
}

// Create a widget showing a player's last online time and activity
mcstats.lastOnlineWidget = function(last) {
    var fmt = formatTime(last);
    if(mcstats.isActive(last)) {
        return `<span class="text-success">${fmt}</span>`;
    } else {
        return `
            <span class="text-danger">${fmt}</span>
        `;
    }
};

// Create an award widget
mcstats.awardWidget = function(id) {
    var award = mcstats.awards[id];
    return `
        <img class="img-pixelated img-textsize-1_5 align-baseline" src="img/award-icons/${id}.png" alt="${id}" title="${award.title}"/>
        <a href="#award:${id}">${award.title}</a>
    `;
}

// Create an event widget
mcstats.eventWidget = function(id) {
    var e = mcstats.events[id];
    var awardId = e.link;
    var award = mcstats.awards[id];
    return `
        <img class="img-pixelated img-textsize-1_5 align-baseline" src="img/award-icons/${awardId}.png" alt="${id}" title="${e.title}"/>
        <a href="#event:${id}">${e.title}</a>
    `;
}

// Get a player face widget
function drawFace(img) {
    var canvas = img.parentNode;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 8, 8, 8, 8, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 40, 8, 8, 8, 0, 0, canvas.width, canvas.height);
}

mcstats.faceWidget = function(skinUrl, css = '') {
    return `
        <canvas width="8" height="8" class="minecraft-face d-inline-block img-pixelated ${css}">
            <img class="d-none" src="${skinUrl}" onload="drawFace(this);"/>
        </canvas>`;
}

// Player widget
mcstats.makePlayerWidget = function(uuid, skinCss, asLink) {
    // get player
    p = mcstats.players[uuid];

    // get player's skin
    if(p['skin']) {
        // compile skin URL
        skin = 'https://textures.minecraft.net/texture/' + p['skin'];
    } else {
        // default skin - find out whether it's Steve or Alex
        var even = parseInt(uuid[ 7], 16) ^
                   parseInt(uuid[15], 16) ^
                   parseInt(uuid[23], 16) ^
                   parseInt(uuid[31], 16);

        skin = 'img/skins/' + (even ? 'alex' : 'steve') + '.png';
    }

    return mcstats.faceWidget(skin, skinCss) +
        (asLink ? `<a href="#player:${uuid}">${p.name}</a>` : p.name);
}

mcstats.playerWidget = function(uuid, skinCss = 'textw-1_5 texth-1_5 align-baseline mr-1', asLink = true) {
    if(uuid) {
        if(uuid in mcstats.players) {
            return mcstats.makePlayerWidget(uuid, skinCss, asLink);
        } else {
            mcstats.cachePlayer(uuid, function(){
                document.getElementById(uuid).innerHTML =
                    mcstats.makePlayerWidget(uuid, skinCss, asLink);
            });
            return `<span id=${uuid}>${uuid}</span>`;
        }
    } else {
        return `<span class="text-muted">(nobody)</span>`;
    }
};

// Remove color codes from a color coded string
mcstats.removeColorCodes = function(str) {
    nofmt = ''
    for(i = 0; i < str.length; i++) {
        if(str.charCodeAt(i) == 167) {
            ++i; // skip color code
        } else {
            nofmt += str[i];
        }
    }
    return nofmt;
}

// Create HTML for a color coded string (e.g. server MOTD)
mcstats.formatColorCode = function(str) {
    html = '';

    color = false;
    level = 0;

    for(i = 0; i < str.length; i++) {
        if(str.charCodeAt(i) == 167) {
            code = str[i+1];
            if(code == 'r') {
                // reset
                html += `</span>`.repeat(level);
                level = 0;
            } else {
                // style
                html += `<span class="mc-text-${code}">`;
                ++level;
            }
            ++i;
        } else {
            html += str[i];
        }
    }

    html += `</span>`.repeat(level);
    return html;
};
