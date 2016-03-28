// lagreSteder.js

/*
* Et script som hjelper til med oppsett av serveren. Kjøres hver gang server.js kjøres.
*/
var http = require('http'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    Sted = require('./app/models/Steder'),
    readline = require('readline'),
    stream = require('stream');

var stederFil = 'steder.txt';

module.exports = {
    
/*
*Sjekker om fila 'steder.txt' finnes. Dersom den ikke gjør det, hentes en fil fra yr sin nettside om viktige steder i norge. Stedene bruke til søk i databasen og info som f.eks. URL til tilhørende XML
*/
checkAndLoadFile: function() {
    fs.stat(stederFil, function(err, stat){
    if(err){
        http.get('http://fil.nrk.no/yr/viktigestader/noreg.txt', function(response){
            response.setEncoding('utf8');
            response.on('data', function(data){
                fs.appendFileSync(stederFil, data, 'utf8');
            });
            response.on('end', function(){
                console.log('No More data');
            })
        });
    } else {
        console.log('File already exists');
    }
});
},

/*
*Sjekker om databasen er blitt opprettet og at den inneholder alle stedene som finnes i fila 'steder.txt'.
*Dersom de ikke finnes blir de lest fra filen og lastet inn i databasen, slik at de kan brukes til søk senere.
*/
checkAndLoadDatabase: function(){
Sted.find(function(err, steder){
    if(err){
        console.log(err);
    } else {
        if(steder.length<=0){
            var inStream = fs.createReadStream('steder.txt');
            var out = new stream;
            var rl = readline.createInterface(inStream, out);
            rl.on('line', function(line){
                var res = line.split('\t');
                if(res[0]!='Kommunenummer' && res.length>0){
                    var sted = new Sted();
                    sted.stedsnavn = res[1];
                    sted.fylke = res[7];
                    sted.kommune = res[6];
                    sted.URL = res[12];
                    sted.stedstype = res[4];
                    sted.save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                
            });
            
            rl.on('close', function(){
                Sted.find(function(err, steder){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('steder: '+steder);
                        return steder;
                    }
                })
            });
        } else {
            return steder;
        }
    }
});
}
};