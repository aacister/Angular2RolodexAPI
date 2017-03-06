var mongoose = require('mongoose');
mongoose.set('debug', true);
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var ContactSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  hobbies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hobby'
  }]
});

ContactSchema.plugin(deepPopulate);


mongoose.model('Contact', ContactSchema);
