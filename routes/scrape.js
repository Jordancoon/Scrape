"use strict";

var express = require('express');
var router = express.Router();
var async = require('async');

// Our scraping tools
var request = require("request");
var rp = require("request-promise");
var cheerio = require("cheerio");

// And our model(s)
var Article = require("../models/Article.js");

function fetchArticles(html, cb) {

  // Load the page into Cheerio
  var $ = cheerio.load(html);

  var posts = [];

  // Find article headlines and links
  $("li.river-block").each(function(i, element) {
    // Empty object for storing results
    var result = {};
    // Fetch the title and link
    result.title = $(this).find("h2.post-title").text();
    result.link = $(this).find("h2.post-title a").attr("href");
    result.timestamp = $(this).find("div.byline time").attr("datetime");
    posts.push(result);
    // console.log("Article object:");
    // console.log(result);
  });

  cb(posts);

};

/* /scrape/ - scrape and save to db */
router.get('/', (req, res) => {

  // Use request-promise for request
  rp("https://techcrunch.com/").
  then((html) => {
    fetchArticles(html, (results) => {
      // Keep track of how many articles we're scraping
      var status = {insertCount: 0};
      // Note the "ordered: false" option.
      // It allows for inserts to continue even if there's a validation error.
      Article.insertMany(results, {ordered:false}, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
          console.log("Total number inserted: "+docs.length);
          status.insertCount = docs.length;
          res.json(status);
          // res.render("index.hbs", {
          //   title: "Scraped articles",
          //   data: docs,
          //   updated: docs.length
          // });
        }
      });
    });
  });

});

module.exports = router;