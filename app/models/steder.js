// app/models/steder.js

// Used for loading steder into the database

var mongoose = require('mongoose');

var stederSchema = mongoose.Schema({
    stedsnavn: String,
    stedstype: String,
    fylke: String,
    kommune: String,
    URL: String
});

stederSchema.index({stedsnavn: 1, fylke: 1, kommune: 1, stedstype: 1});

module.exports = mongoose.model('Steder', stederSchema);