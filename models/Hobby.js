var mongoose = require('mongoose');
mongoose.set('debug', true);
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var HobbySchema = new mongoose.Schema({
  title: String
});

HobbySchema.plugin(deepPopulate);

mongoose.model('Hobby', HobbySchema);
