var express = require('express');
var router = express.Router();

// Pull in model(s)
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

/* GET articles page. */
router.get('/', function(req, res, next) {
  // Get the articles from the db
  Article.find({}, null, {sort: {timestamp:-1}})
  .populate("note")
  .exec(function (err, data) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(data);
    }
  });
});

/* GET favorites */
router.get('/favorites', function(req, res, next) {
  // Get the articles from the db
  Article.find({favorite: true}, null, {sort: {timestamp:-1}})
  .populate("note")
  .exec(function (error, data) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.render("index", {
        title: "Scraped articles",
        data: data
      });
      // res.json(data);
    }
  });
});

/* POST favorites */
router.post('/favorites', function(req, res, next) {
  console.log(req.body.favorite);
  // Update the favorite param for specified article
  // Note the use of {new: true}.
  // Without that flag, this will return the original, unaltered document to
  // the client via the data variable. Makes no sense. But that's how it works.
  Article.findOneAndUpdate({_id: req.body.id}, {favorite: req.body.favorite}, {new: true})
  .exec(
    function(error, data) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(data);
    }
  });
});

router.get('/remove', function (req, res, next) {
  Article.remove({}, function (err, removed) {
    Note.remove({}, function (err, removed) {
      console.log("Articles removed.");
      res.json({status: "articles and notes removed"});
    })
  });
});

module.exports = router;