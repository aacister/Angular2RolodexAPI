var router = require('express').Router();
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Hobby = mongoose.model('Hobby');
var auth = require('../auth');

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


//Get all hobbies
router.get('/', auth.optional, (req, res, next) => {
  Hobby.find().exec(function(err, hobbies){
    if(err){
      return next(err);
    }
    res.json(hobbies);
  });
});

//Get a hobby
router.get('/:hobby', auth.optional,  function(req, res, next){
  Hobby.findById(req.params.hobby, function(err, hobby) {
      if (err) res.send(err);
    res.json(hobby);
  });
});

//Add a new hobby
router.post('/', auth.optional,  function(req, res, next){
  var hobby = new Hobby(req.body.hobby);

  hobby.save(function(err, hobby){
    if(err){
      return next(err);
    }
    res.json(hobby);

  });
});

// Edit a contact
router.put('/:hobby', auth.optional,  function(req, res, next) {
    Hobby.findById(req.params.hobby, function(err, hobby) {
        if (err) res.send(err);
        if (req.body.title) hobby.title = req.body.title;

        hobby.save(function(err, savedHobby) {
            if (err) send(err);

            res.json(savedHobby);
        });
    });
});


//Delete a hobby
router.delete('/:hobby',  auth.optional, function(req, res, next){
  Hobby.remove({
    _id: req.params.hobby
  }, function(err, contact){
    if(err) return next(err);

    res.sendStatus(204);
  })
});


module.exports = router;
