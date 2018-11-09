var express = require('express');
var router = express.Router();

// Pull in model(s)
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

/* POST favorites */
router.post('/', function(req, res, next) {
  var newNote = new Note(req.body);

  // Save it to the db
  newNote.save(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      // Use the article id to find and update its note
      // Note the use of {new: true}.
      // Without that flag, this will return the original, unaltered document to
      // the client via the data variable. Makes no sense. But that's how it works.
      Article.findOneAndUpdate({ "_id": req.body.articleID }, { "note": doc._id }, {new: true})
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.json(doc);
        }
      });
    }
  });
});
