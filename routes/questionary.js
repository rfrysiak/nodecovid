var express = require('express');
var router = express.Router();
var Questionary = require('../models/questionary');

/* GET questionary page. */
router.get('/:id', function (req, res) {
    Questionary.findById(req.params.id).exec(function(err, questionary) {
        if (err) res.send(err);
        if (questionary) res.render('questionary', { title: 'Kwestionariusz', body: questionary });
        else     res.render('questionary', { title: 'Kwestionariusz' });
    });
});

/* POST questionary page. */
router.post('/:id', function (req, res) {
    Questionary.findByIdAndUpdate(req.params.id, {
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question3,
        question4: req.body.question4,
        question5: req.body.question5,
        question6: req.body.question6,
        question7: req.body.question7,
        question8: req.body.question8,
        question9: req.body.question9,
        question10: req.body.question10,
        question11: req.body.question11,
        question12: req.body.question12,
        question13: req.body.question13,
        question14: req.body.question14,
        question15: req.body.question15,
        question16: req.body.question16,
        question17: req.body.question17,
        question18: req.body.question18,
        question19: req.body.question19,
    }).exec(function(err) {
        if (err) res.send(err);
        res.render('questionary', { title: 'Kwestionariusz', body: req.body });
    });
});

module.exports = router;
