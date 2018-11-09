var express = require('express');
var router = express.Router();

// Pull in model(s)
var Article = require("../models/Article.js");



router.get('/', function(req, res, next) {
  // Get the articles from the db
  Article.find({}, null, {sort: {timestamp:-1}})
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

module.exports = router;