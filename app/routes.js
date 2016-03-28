// app/routes.js

var mongoose = require('mongoose'),
    Steder = require('./models/Steder'),
    server = require('../server.js'),
    http = require('http');

module.exports = function(app){
    //set up api routes ==================================================
    
    /**
    *Sender respons tilbake til klienten med en liste over alle stedsnavn som inneholder stedet de har søkt på
    *@req   request som er send til serveren. Inneholder søkekriteriet gjennom req.param('userinput').
    *@res   respons som sendes tilbake til klienten etter søk i databasen 
    */
    app.get('/api/steder', function(req, res){
        console.log('userinput: '+req.param('userinput'));
        var regex = new RegExp(req.param('userinput'), 'i');
        Steder.find({stedsnavn: regex},function(err, steder){
            if(err){
                res.send(err);
            }
            console.log(steder.length);
            if(steder.length>=1){
                res.json(steder);
            } else {
                res.send('Vi fant ingen treff på '+req.param('userinput'));
            }
            
        })
    });
    
    /**
    *Sender respons til klienten med en json-string som er oversatt fra xml'en som er etterspurt.
    *@req   request som er send til serveren. Inneholder url'en til xml'en som skal sendes tilbake gjennom req.param('URL')
    *@res   respons som sendes tilbake til klienten. En xml-fil som er oversatt fra xml til json
    */
    app.get('/api/forecast', function(req, res){
        console.log('Request param: '+req.param('URL'));
        http.get(req.param('URL'), function(response){
            response.setEncoding('utf8');
            var xmlString = '';
            response.on('data', function(data){
               xmlString+=data;
            });
            response.on('end', function(data){
                console.log('Data done!');
                var parser = require('xml2js').Parser({attrkey: '$'});
                parser.parseString(xmlString, function(err, result){
                    console.log(result.weatherdata.credit[0].link[0].$.url);
                    res.json(result.weatherdata);
                });
            });
    });
    });
    
    
};