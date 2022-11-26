const express = require( 'express' );

const app = express();
const fs = require( 'fs' );

app.use( express.static( '.', {
    fallthrough: true
}) );

/* eslint-disable-next-line no-unused-vars */
app.use( function( req, res, next ) {
    res.set( 'Content-Type', 'text/html' );
    res.send( Buffer.from( fs.readFileSync( './index.html' ) ) );
});

app.listen( 8001, function() {
    console.log( 'Listening...' );
});
