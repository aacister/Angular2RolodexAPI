var router = require('express').Router();
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Contact = mongoose.model('Contact');
var Hobby = mongoose.model('Hobby');
var auth = require('../auth');

router.param('contact', function(req, res, next, id){
  var query = Contact.findById(id);

  query.exec(function(err, contact){
      if(err)
        return next(err);
      if(!contact) {return res.sendStatus(404);}

      req.contact = contact;
      return next();
  });
});

router.param('hobby', function(req, res, next, id){
  var query = Hobby.findById(id);

  query.exec(function(err, hobby){
    if(err){
      return next(err);
    }
    if(!hobby) {return res.sendStatus(404);}

    req.hobby = hobby;
    return next();
  });
});

//Get all contacts
router.get('/', auth.optional, function(req, res, next){
  Contact.find().deepPopulate(['hobbies']).exec(function(err, contacts){
    if(err){
      return next(err);
    }
    console.log('Contacts: ' + contacts);
    res.json(contacts);
  });
});


//Get a contact
router.get('/:contact',auth.optional, function(req, res, next){
  Contact.findById(req.params.contact, function(err, contact) {
      if (err) res.send(err);

      contact.deepPopulate(['hobbies'], function(err, c){
      res.json(c);
    });
  });
});

//Add a new contact
router.post('/', auth.optional, function(req, res, next){
  var contact = new Contact(req.body.contact);

  contact.save(function(err, contact){
    if(err){
      return next(err);
    }
    contact.deepPopulate(['hobbies'], function(err, contact){
      res.json(contact);
    });
  });
});

// Edit a contact
router.put('/:contact', auth.optional,function(req, res, next) {
    Contact.findById(req.params.contact, function(err, contact) {
        if (err) res.send(err);
        if (req.body.contact.first_name) contact.first_name = req.body.contact.first_name;
        if (req.body.contact.last_name) contact.last_name = req.body.contact.last_name;
        if (req.body.contact.email) contact.email = req.body.contact.email;


        contact.save(function(err, savedContact) {
            if (err) send(err);
            savedContact.deepPopulate(['hobbies'], function(err, contact){
              res.json(contact);
          });
        });
    });

});

//Add a new hobby to contact
router.post('/:contact/hobbies',auth.optional, function(req, res, next){
  console.log('Hobby passed: ' + JSON.stringify(req.body.hobby));
  Hobby.findById(req.body.hobby.id, function(err, h){

  Contact.findById(req.params.contact, function(err, contact) {
      if (err) res.send(err);

    contact.hobbies.push(h);
    contact.save(function(err, savedContact){
      if(err){
        return next(err);
      }
      savedContact.deepPopulate(['hobbies'], function(err, contact){
        res.json(contact);
    });
    });
  });
});

});

//Delete a contact
router.delete('/:contact', auth.optional,function(req, res, next){
  Contact.remove({
    _id: req.params.contact
  }, function(err, contact){
    if(err) return next(err);

    res.sendStatus(204);
  })
});

// Delete a hobby
router.delete('/:contact/hobbies/:hobby',auth.optional,function(req, res, next) {
  Contact.findById(req.params.contact, function(err, contact){
    if(err){
      return next(err);
    }
    //Remove item from hobbies array, and save contact
    var index = contact.hobbies.indexOf(req.params.hobby);
    contact.hobbies.splice(index, 1);
    contact.save(function(err){
      if(err){
        return next(err);
      }
      res.sendStatus(204);
    });
  });

});

module.exports = router;
