var router = require('express').Router();


router.use('/contacts', require('./contacts'));
router.use('/hobbies', require('./hobbies'));

module.exports = router;
