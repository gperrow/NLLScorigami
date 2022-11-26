import iatest
import sys,datetime

c = iatest.Connection( 'uid=dba;pwd=sql' )

curs = c.cursor()
curs.execute( """select dateformat( G.dt, 'Mmm Dd, YYYY' ) as dt, G.winning_score, G.losing_score,
    replace( W.team, '[1]', '' ) as winner, replace( L.team, '[1]', '' ) as loser, G.minigame, G.playoffs, G.overtime,
    replace( H.team, '[1]', '' ) as home_team, G.season
    from games G
    join teams W on G.winner=W.id
    join teams L on G.loser=L.id
    join teams H on G.home=H.id
    order by G.dt asc""" )
rows = curs.fetchall()
curs.close()
c.close()

with open( 'json/games.json', 'w' ) as f:
    now = datetime.datetime.now().strftime( '%a %b %d, %Y %I:%M:%S %p EST' )
    f.write( '{\n"last_updated": "%s",\n"games": [\n' % now )
    output = []
    for g in rows:
        fmt = '{ "dt": "%s", "winning_score": %s, "losing_score": %s, "winner": "%s", "loser": "%s", ' + \
            '"minigame": %s, "playoffs": %s, "overtime": %s, "home_team": "%s", "season": "%s" }'
        output.append( fmt % g )
    #
    f.write( ',\n'.join( output ) )
    f.write( '\n]\n}\n' )
#
