/* globals window */

let scores = {};
let max_win = 0;
let max_lose = 0;
let divisions = [];

const multipleNameTeams = [ {
    name: 'Rochester Knighthawks',
    last_season: 2019
}, {
    name: 'Boston Blazers',
    last_season: 1997
}, {
    name: 'Philadelphia Wings',
    last_season: 2014
} ];

function getClass( num ) {
    if( num === 0 ) {
        return 'none';
    }
    if( num === 1 ) {
        return 'single';
    }
    let index = 2;
    for( let d of divisions ) {
        if( num < d ) {
            return `div${index}`;
        }
        index++;
    }
    return 'lots';
}

function handleMouseOver( x, y ) {
    if( y !== -1 ) {
        // Add adjhover to elements in the same row
        for( let win = 0; win <= max_win; win++ ) {
            const id = `#hover_${win}-${y}`;
            const cell = $( id );
            if( win === x ) {
                cell.addClass( 'over' );
            } else {
                cell.addClass( 'adjhover' );
            }
        }
        $( `#hover_lose_axis_${y}` ).addClass( 'adjhover' );
    }

    if( x !== -1 ) {
        // And to elements in the same column
        for( let lose = 0; lose <= max_lose; lose++ ) {
            const id = `#hover_${x}-${lose}`;
            const cell = $( id );
            if( lose === y ) {
                cell.addClass( 'over' );
            } else {
                cell.addClass( 'adjhover' );
            }
        }
        $( `#hover_win_axis_${x}` ).addClass( 'adjhover' );
    }
}

function handleMouseOut( x, y ) {
    if( y !== -1 ) {
        // Remove adjhover from elements in the same row
        for( let win = 0; win <= max_win; win++ ) {
            const id = `#hover_${win}-${y}`;
            const cell = $( id );
            if( win === x ) {
                cell.removeClass( 'over' );
            } else {
                cell.removeClass( 'adjhover' );
            }
        }
        $( `#hover_lose_axis_${y}` ).removeClass( 'adjhover' );
    }

    if( x !== -1 ) {
        // And from elements in the same column
        for( let lose = 0; lose <= max_lose; lose++ ) {
            const id = `#hover_${x}-${lose}`;
            const cell = $( id );
            if( lose === y ) {
                cell.removeClass( 'over' );
            } else {
                cell.removeClass( 'adjhover' );
            }
        }
        $( `#hover_win_axis_${x}` ).removeClass( 'adjhover' );
    }
}

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' };
function formatGame( game ) {
    const date = new Date( game.dt ).toLocaleDateString( 'en-US', dateOptions );

    let out = `${game.winner} ${game.winning_score}`;
    if( game.winner === game.home_team ) {
        out += ' vs ';
    } else {
        out += ' @ ';
    }
    let details = [];
    if( game.overtime ) {
        details.push( '(OT)' );
    }
    if( game.playoffs ) {
        details.push( '(Playoffs)' );
    }
    if( game.minigame ) {
        details.push( '(MG)' );
    }
    out += `${game.loser} ${game.losing_score} | ${details.join( ' ' )} ${date}`;
    return out;
}

function formatGameForList( game ) {
    const date = new Date( game.dt ).toLocaleDateString( 'en-US', dateOptions );

    let out = `<tr><td>${date}</td><td><b>${game.winner} ${game.winning_score}</b>`;
    if( game.winner === game.home_team ) {
        out += ' vs ';
    } else {
        out += ' @ ';
    }
    let details = [];
    if( game.overtime ) {
        details.push( 'Overtime' );
    }
    if( game.playoffs ) {
        details.push( 'Playoffs' );
    }
    if( game.minigame ) {
        details.push( 'Mini-game' );
    }
    out += `${game.loser} ${game.losing_score}</td><td>${details.join( ', ' )}</td></tr>`;
    return out;
}

function closeInfoBox() {
    var infoBox = document.getElementById( 'infobox' );
    if( infoBox ) {
        infoBox.classList.add( 'hidden' );
    }
    $( '#gamelist' ).html( '' );
}

/* eslint-disable max-statements */
function handleClick( x, y ) {
    closeInfoBox();
    if( !scores[x] || !scores[x][y] || scores[x][y].length === 0 ) {
        return;
    }

    const data = scores[x][y];

    var html = `<span id="infoBoxScore">Score: ${x}-${y}, ${data.length} game${data.length === 1 ? '' : 's'}</span>`;
    var gamelist = data.map( formatGameForList );
    var otgames = data.filter( g => g.overtime );
    var playoffgames = data.filter( g => g.playoffs );
    var minigames = data.filter( g => g.minigame );
    var gamelist_html = `<h3>Final score ${x}-${y}</h3><p>${data.length} game${data.length === 1 ? '' : 's'}</p><table border="0">
${gamelist.join( '' )}
</table>`;
    const detailTotals = [];
    if( otgames.length > 0 ) {
        detailTotals.push( `${otgames.length} overtime game${otgames.length === 1 ? '' : 's'}` );
    }
    if( playoffgames.length > 0 ) {
        detailTotals.push( `${playoffgames.length} playoff game${playoffgames.length === 1 ? '' : 's'}` );
    }
    if( minigames.length > 0 ) {
        detailTotals.push( `${minigames.length} mini-game${minigames.length === 1 ? '' : 's'}` );
    }
    if( detailTotals.length > 0 ) {
        gamelist_html += `<p>${detailTotals.join( '<br />' )}</p>`;
    }
    $( '#gamelist' ).html( gamelist_html );

    html += '<span id="infoBoxClose" onclick="closeInfoBox()">(<u>close</u>)</span>';
    html += `<br/>${data.length === 1 ? '' : 'First Game: <br>'}${formatGame( data[0] )}<br />`;

    if( data.length > 1 ) {
        const ind = data.length-1;
        html += `Latest Game: <br>${formatGame( data[ind] )}<br />`;
    }

    const infoBox = document.getElementById( 'infobox' );
    infoBox.innerHTML = html;
    infoBox.classList.remove( 'hidden' );

    infoBox.style.left = 0;
    infoBox.style.right = '';
    infoBox.style.width = '';
    infoBox.style.top = 0;

    const cell = document.getElementById( `td_${x}-${y}` );

    var INFOBOX_OUTER_PIXELS = 5;
    var cellRect = cell.getBoundingClientRect();
    var infoBoxRect = infoBox.getBoundingClientRect();
    var windowRight = window.pageXOffset + document.documentElement.clientWidth;
    var boxLeft = 0;
    var boxRight = 0;
    //if the box would extend past the right side of the screen, place it on the right side of the screen
    if( window.pageXOffset + cellRect.x - ( infoBoxRect.width + cellRect.width ) / 2 + infoBoxRect.width + 2 * INFOBOX_OUTER_PIXELS > windowRight ) {
        boxRight = document.body.offsetWidth - document.documentElement.clientWidth - window.pageXOffset;
        boxLeft = Math.floor( windowRight - infoBoxRect.width );
    } else {
        //otherwise center it horizontally on the clicked cell
        boxLeft =   window.pageXOffset + cellRect.x - ( infoBoxRect.width + cellRect.width ) / 2;
        infoBox.style.width = infoBoxRect.width;
    }
    //if the box would extend past the left side of the screen, place it on the left side of the screen
    if( boxLeft < window.pageXOffset ) {
        boxLeft = window.pageXOffset;
    }
    infoBox.style.left = boxLeft;
    infoBox.style.right = boxRight;
    infoBoxRect = infoBox.getBoundingClientRect();
    //place it above the cell, unless it would extend past the top of the screen
    if( cellRect.y - infoBoxRect.height - 2 * INFOBOX_OUTER_PIXELS < 0 ) {
        infoBox.style.top = window.pageYOffset + cellRect.y + cellRect.height - 2 * INFOBOX_OUTER_PIXELS;
    } else {
        infoBox.style.top = window.pageYOffset + cellRect.y - infoBoxRect.height - 2 * INFOBOX_OUTER_PIXELS;
    }
}

/* eslint-disable-next-line no-unused-vars */
function toggleCounts() {
    const on = $( '#counts:checked' ).val() === 'on';

    for( let lose = 0; lose <= max_lose; lose++ ) {
        for( let win = lose+1; win <= max_win; win++ ) {
            const id = `#count_${win}-${lose}`;
            const cell = $( id );
            if( on ) {
                cell.removeClass( 'hidden' );
            } else {
                cell.addClass( 'hidden' );
            }
        }
    }
}

function showLegend() {
    // We hide the legend initially and then unhide it once the table is displayed to avoid it flashing
    $( '#legend' ).removeClass( 'hidden' );
}

function createLegend() {
    let max_count = 0;
    for( let win in scores ) {
        for( let lose in scores[win] ) {
            const count = scores[win][lose].length;
            if( count > max_count ) {
                max_count = count;
            }
        }
    }

    divisions = [ 10, 25, 50, 75, 100 ];
    if( max_count < 10 ) {
        divisions = [ 5, 10 ];
    } else if( max_count < 25 ) {
        divisions = [ 5, 10, 20 ];
    } else if( max_count < 40 ) {
        divisions = [ 5, 10, 20, 30 ];
    }

    let html = `<table border="1">
    <tr>
        <th colspan="2">Legend</th>
    </tr>
    <tr>
        <td>&nbsp;No games&nbsp;</td><td class="fixedtd none"></td>
    </tr>
    <tr>
        <td>&nbsp;One game&nbsp;</td><td class="fixedtd single"></td>
    </tr>`;

    let index = 2;
    divisions.forEach( div => {
        html += `<tr>
            <td>&nbsp;&lt;${div} games&nbsp;</td><td class="fixedtd div${index}"></td>
        </tr>`;
        index++;
    });
    html += `<tr>
        <td>&nbsp;${divisions[divisions.length-1]}+ games&nbsp;</td><td class="fixedtd lots"></td>
    </tr>
    </table>`;

    $( '#legend' ).html( html );
}

let _gamedata = null;
let first = true;
let _teamlist = null;

function handleClickAxis( x, y ) {
    closeInfoBox();
    if( ( x === -1 && y === -1 ) || ( x !== -1 && y !== -1 ) || ( y === -1 && !scores[x] ) ) {
        return;
    }

    let data = [];
    if( x === -1 ) {
        data = Object.keys( scores ).flatMap( win => scores[win][y] );
    } else {
        data = Object.keys( scores[x] ).flatMap( lose => scores[x][lose] );
    }
    data = data.filter( obj => !!obj ).sort( ( obja, objb ) => {
        const dt1 = new Date( obja.dt );
        const dt2 = new Date( objb.dt );
        return ( dt1 > dt2 ) ? 1 : ( dt1 < dt2 ) ? -1 : 0;
    });

    var html = `<span id="infoBoxScore">`;
    if( x === -1 ) {
        html += `Losing score ${y}`;
    } else {
        html += `Winning score ${x}`;
    }
    html += `, ${data.length} game${data.length === 1 ? '' : 's'}</span>`;
    html += '<span id="infoBoxClose" onclick="closeInfoBox()">(<u>close</u>)</span>';
    html += `<br/>${data.length === 1 ? '' : 'First Game: <br>'}${formatGame( data[0] )}<br />`;

    if( data.length > 1 ) {
        const ind = data.length-1;
        html += `Latest Game: <br>${formatGame( data[ind] )}<br />`;
    }

    const infoBox = document.getElementById( 'infobox' );
    infoBox.innerHTML = html;
    infoBox.classList.remove( 'hidden' );

    infoBox.style.left = 0;
    infoBox.style.right = '';
    infoBox.style.width = '';
    infoBox.style.top = 0;

    const cell = document.getElementById( x === -1 ? `hover_lose_axis_${y}` : `hover_win_axis_${x}` );

    var INFOBOX_OUTER_PIXELS = 5;
    var cellRect = cell.getBoundingClientRect();
    var infoBoxRect = infoBox.getBoundingClientRect();
    var windowRight = window.pageXOffset + document.documentElement.clientWidth;
    var boxLeft = 0;
    var boxRight = 0;
    //if the box would extend past the right side of the screen, place it on the right side of the screen
    if( window.pageXOffset + cellRect.x - ( infoBoxRect.width + cellRect.width ) / 2 + infoBoxRect.width + 2 * INFOBOX_OUTER_PIXELS > windowRight ) {
        boxRight = document.body.offsetWidth - document.documentElement.clientWidth - window.pageXOffset;
        boxLeft = Math.floor( windowRight - infoBoxRect.width );
    } else {
        //otherwise center it horizontally on the clicked cell
        boxLeft =   window.pageXOffset + cellRect.x - ( infoBoxRect.width + cellRect.width ) / 2;
        infoBox.style.width = infoBoxRect.width;
    }
    //if the box would extend past the left side of the screen, place it on the left side of the screen
    if( boxLeft < window.pageXOffset ) {
        boxLeft = window.pageXOffset;
    }
    infoBox.style.left = boxLeft;
    infoBox.style.right = boxRight;
    infoBoxRect = infoBox.getBoundingClientRect();
    //place it above the cell, unless it would extend past the top of the screen
    if( cellRect.y - infoBoxRect.height - 2 * INFOBOX_OUTER_PIXELS < 0 ) {
        infoBox.style.top = window.pageYOffset + cellRect.y + cellRect.height - 2 * INFOBOX_OUTER_PIXELS;
    } else {
        infoBox.style.top = window.pageYOffset + cellRect.y - infoBoxRect.height - 2 * INFOBOX_OUTER_PIXELS;
    }
}

function handleGames( gamedata, options ) {
    const { showMinigames, showRegSeason, showPlayoffs } = options;
    let team = options.team || 'All';

    if( !_gamedata ) {
        _gamedata = gamedata;
    }
    scores = {};

    // Get rid of old mouse handlers
    for( let lose = 0; lose <= max_lose; lose++ ) {
        for( let win = lose+1; win <= max_win; win++ ) {
            const id = `#td_${win}-${lose}`;
            const cell = $( id );
            cell.off();
        }
    }

    const old = !!team.match( /\[old\]$/ );
    if( old ) {
        team = team.replace( ' [old]', '' );
    }
    gamedata.games.forEach( g => {
        if( !showMinigames && g.minigame ) {
            return;
        }
        if( !showRegSeason && !g.playoffs ) {
            return;
        }
        if( !showPlayoffs && g.playoffs ) {
            return;
        }
        if( team !== 'All' ) {
            if( g.winner !== team && g.loser !== team ) {
                return;
            }
            const t = multipleNameTeams.find( m => m.name === team );
            if( t && ( ( old && g.season > t.last_season ) || ( !old && g.season <= t.last_season ) ) ) {
                return;
            }
        }

        const w = g.winning_score;
        const l = g.losing_score;
        scores[w] = scores[w] || {};
        scores[w][l] = scores[w][l] || [];
        scores[w][l].push( g );
        if( first ) {
            max_win = Math.max( w, max_win );
            max_lose = Math.max( l, max_lose );
        }
    });
    // Show legend before creating the table so that we create the divisions before the getClass function is called
    createLegend();

    if( !_teamlist ) {
        const getTeam = ( name, season ) => {
            for( const t of multipleNameTeams ) {
                if( t.name === name ) {
                    if( season > t.last_season ) {
                        return name;
                    }
                    return `${name} [old]`;
                }
            }
            return name;
        };
        let teamlist = new Set();
        for( let win in scores ) {
            for( let lose in scores[win] ) {
                for( let g of scores[win][lose] ) {
                    teamlist.add( getTeam( g.winner, g.season ) );
                    teamlist.add( getTeam( g.loser, g.season ) );
                }
            }
        }
        teamlist = [ ...teamlist.keys() ] // convert to a list
        .sort();
        let teamlist_html = '<select id="teamselector" name="team"><option selected="selected" value="All">All teams</option>';
        teamlist_html += teamlist.map( t => `<option value="${t}">${t}</option>` )
        .join( '' );
        teamlist_html += '</select>';
        $( '#teamlist' ).html( teamlist_html );
        $( '#teamselector' ).change( changeteam ); /* eslint-disable-line no-use-before-define */
        _teamlist = teamlist;
    }

    first = false;
    let out = `<table class="fixedtable">
    <tr>
        <td id='hAxisLabel' class='axisLabel' colspan="${max_win+2}">Winning Score</td>
        <td id='vAxisLabel' class='axisLabel' rowspan="${max_lose+3}"><div class='vertical'>Losing Score</div></td>
    </tr>`;
    for( let win = 0; win <= max_win; win++ ) {
        out += `<th id="hover_win_axis_${win}" class="topaxis">${win}</th>`;
    }
    out += '<th>&nbsp;</th></tr>';

    const showCounts = $( '#counts:checked' ).val() === 'on';

    for( let lose = 0; lose <= max_lose; lose++ ) {
        out += '<tr>';
        for( let win = 0; win <= max_win; win++ ) {
            if( win <= lose ) {
                out += '<td class="black"></td>';
            } else {
                const list = ( scores[win] || {})[lose] || [];
                const num = list.length;
                const id = `${win}-${lose}`;

                out += `<td id="td_${id}" class="${getClass( num )}">
                    <div class="hover" id="hover_${id}">
                    <div class="count${showCounts ? '' : ' hidden'}" style="font-size: 10px"
                        id="count_${id}">${list.length ? `${list.length}` : '' }</div>
                    </div></td>`;
            }
        }
        out += `<th id="hover_lose_axis_${lose}" class="rightaxis" align="center">${lose}</th></tr>`;
    }
    out += `<tr>
        <td class='lastrow' colspan="${max_win+1}"></td>
    </tr>
    </table>`;
    $( '#scorigami' ).html( out );

    let recent_dt = null;
    let recent_g = null;
    Object.keys( scores ).forEach( win => {
        Object.keys( scores[win] || {}).forEach( lose => {
            const g = scores[win][lose][0];
            if( !g.minigame && ( recent_dt === null || new Date( g.dt ) > recent_dt ) ) {
                recent_dt = new Date( g.dt );
                recent_g = g;
            }
        });
    });
    let mostrecent = `${recent_g.dt}: ${recent_g.winner} ${recent_g.winning_score}` +
        ( recent_g.winner === recent_g.home_team ? ' vs. ' : ' @ ' ) +
        `${recent_g.loser} ${recent_g.losing_score}`;
    $( '#mostrecent' ).html( mostrecent );

    const dt = new Date( _gamedata.sLatestDate );
    let hrs = dt.getHours();
    let ampm = 'AM';
    if( hrs >= 12 ) {
        if( hrs >= 13 ) {
            hrs -= 12;
        }
        ampm = 'PM';
    }
    if( hrs === 0 ) {
        hrs = 12;
    }
    hrs = `0${hrs}`.substr( -2 );
    const min = `0${dt.getMinutes()}`.substr( -2 );

    const sep = '&nbsp;&nbsp;&#9679;&nbsp;&nbsp;';
    const thisYear = ( new Date() ).getYear() + 1900;
    let copyright = `2022-${thisYear}`;
    const footers = [
        `Data updated on ${$.datepicker.formatDate( 'M d, yy', dt )} ${hrs}:${min} ${ampm}`,
        `<a href="/about.html">About this site</a>`,
        `All pages copyright &copy; ${copyright} Graeme Perrow`
    ];
    $( '#footertext' ).html( footers.join( sep ) );

    $( '#greenLogo' ).html( `<!-- GreenGeeks Seal Code -->
        <div><a href="#" onclick="ggs_ggseal()"><img src="https://static.greengeeks.com/ggseal/Green_15.png"></a>
        <script>function ggs_ggseal(){window.open("https://my.greengeeks.com/seal/","_blank")}</script>
        </div>
        <!-- End GreenGeeks Seal Code -->` );

    showLegend();

    // Now add the mouse handlers
    for( let lose = 0; lose <= max_lose; lose++ ) {
        for( let win = lose+1; win <= max_win; win++ ) {
            const id = `#td_${win}-${lose}`;
            const cell = $( id );
            cell.mouseover( () => handleMouseOver( win, lose ) );
            cell.mouseout( () => handleMouseOut( win, lose ) );
            cell.click( () => handleClick( win, lose ) );
        }
        const id = `#hover_lose_axis_${lose}`;
        const cell = $( id );
        cell.mouseover( () => handleMouseOver( -1, lose ) );
        cell.mouseout( () => handleMouseOut( -1, lose ) );
        cell.click( () => handleClickAxis( -1, lose ) );
    }
    for( let win = 1; win <= max_win; win++ ) {
        const id = `#hover_win_axis_${win}`;
        const cell = $( id );
        cell.mouseover( () => handleMouseOver( win, -1 ) );
        cell.mouseout( () => handleMouseOut( win, -1 ) );
        cell.click( () => handleClickAxis( win, -1 ) );
    }
}

function _toggle() {
    closeInfoBox();
    const showMinigames = $( '#minigames:checked' ).val() === 'on';
    const showRegSeason = $( '#regseason:checked' ).val() === 'on';
    const showPlayoffs = $( '#playoffs:checked' ).val() === 'on';
    const team = $( '#teamselector' ).val();
    handleGames( _gamedata, { team, showMinigames, showRegSeason, showPlayoffs });
}

function changeteam() {
    _toggle();
}


/* eslint-disable-next-line no-unused-vars */
function toggleMinigames() {
    _toggle();
}

/* eslint-disable-next-line no-unused-vars */
function toggleRegSeason() {
    const showRegSeason = $( '#regseason:checked' ).val() === 'on';
    const showPlayoffs = $( '#playoffs:checked' ).val() === 'on';
    if( !showRegSeason && !showPlayoffs ) {
        $( '#playoffs' ).prop( 'checked', true );
    }
    _toggle();
}

/* eslint-disable-next-line no-unused-vars */
function togglePlayoffs() {
    const showRegSeason = $( '#regseason:checked' ).val() === 'on';
    const showPlayoffs = $( '#playoffs:checked' ).val() === 'on';
    if( !showRegSeason && !showPlayoffs ) {
        $( '#regseason' ).prop( 'checked', true );
    }
    _toggle();
}

let _globalData = {
    getData: {},
    oDataUpdate: {},
    oData: {},
    sLatestDate: null
};

async function initData() {
    const files = [ 'games' ];
    let latestDate = null;

    $.ajaxSetup({ cache: false }); // was having a problem getting cached data

    const loadFile = file => {
        if( _globalData.getData[file] ) {
            return;
        }
        _globalData.getData[file] = new Promise( resolve => {
            return $.ajax( `/json/${file}.json`, {
                complete: function( jqXHR, textStatus ) {
                    if( textStatus !== 'success' ) {
                        $( '#status' ).html( '<p>' + textStatus + '</p>' );
                        resolve( [] );
                        return;
                    }
                    const data = jqXHR.responseJSON;
                    _globalData.oDataUpdate[file] = new Date( data.last_updated );
                    if( !latestDate || _globalData.oDataUpdate[file] > latestDate ) {
                        latestDate = _globalData.oDataUpdate;
                        _globalData.sLatestDate = data.last_updated;
                    }
                    _globalData.oData[file] = data[file];
                    resolve();
                }
            });
        });
    };

    files.forEach( loadFile );
    await Promise.all( files.map( f => _globalData.getData[f] ) );
}

function main() {
    /* eslint-disable-next-line no-undef */
    if( production() ) {
        $( '#statcounter' ).html( `<!-- Default Statcounter code for NLL Scorigami
http://nllscorigami.com -->
<script type="text/javascript">
var sc_project=12721524; 
var sc_invisible=1; 
var sc_security="21dfd60f"; 
</script>
<script type="text/javascript"
src="https://www.statcounter.com/counter/counter.js"
async></script>
<noscript><div class="statcounter"><a title="Web Analytics"
href="https://statcounter.com/" target="_blank"><img
class="statcounter"
src="https://c.statcounter.com/12721524/0/21dfd60f/1/"
alt="Web Analytics"
referrerPolicy="no-referrer-when-downgrade"></a></div></noscript>
` );
    }

    const gamedata = {
        games: _globalData.oData.games,
        sLatestDate: _globalData.sLatestDate
    };

    return handleGames( gamedata, { showMinigames: true, showRegSeason: true, showPlayoffs: true });
}

$( document ).ready( function() {
    initData()
    .then( () => {
        main();
    })
    .catch( e => {
        $( '#status' ).html( e.stack || e.message || e );
    });
});
