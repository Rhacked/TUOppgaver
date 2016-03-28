// server.js

//moduler ================================================================
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    stederHandler = require('./lagreSteder.js'),
    morgan = require('morgan');
//sett port ==============================================================
var port = 34300;


//koble til database =====================================================
mongoose.connect('mongodb://admin:adminsen@ds025439.mlab.com:25439/tuoppgaver');

// sett opp middleware ===================================================
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname+'/public'));

app.use(morgan('dev'));

// sjekk steder.txt fil og om de finnes i databasen ======================
stederHandler.checkAndLoadFile();
stederHandler.checkAndLoadDatabase();

//sett opp ruter i backend ===============================================
require('./app/routes')(app);

//start server ===========================================================
app.listen(port);