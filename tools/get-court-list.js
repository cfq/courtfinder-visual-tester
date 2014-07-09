var fs = require('fs');
var https = require('https');

var liveCourtListURL = 'https://courttribunalfinder.service.gov.uk/courts.json';
var outfile = '../data/courtlist.json';

var courtlist = undefined;
var outputObj = [];

https.get( liveCourtListURL, function ( res ){
  var d = [];

  res.setEncoding('utf8');
  res.on('data', function ( chunk ){
    d.push(chunk);
  });

  res.on('end', function () {
    courtlist = JSON.parse(d.join('')).courts;

    buildOutputObject();
    writeToFile();
  });
});

function buildOutputObject(){
  for( var i = 0; i < courtlist.length; i++ ){
    outputObj.push({
      "@id": courtlist[i]['@id'],
      name: courtlist[i]['name']
    });
  }
}

function writeToFile(){
  fs.writeFile( outfile, JSON.stringify({courts: outputObj}), function ( err ){
    if( err )
      console.log("Error: ", err);

    console.log('Done. ', new Date());
  });
}