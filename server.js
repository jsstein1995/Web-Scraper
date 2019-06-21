var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("./models");
var PORT = 3000;
var app = express();
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
// A GET route for scraping the WSJ website
app.get("/scrape", function(req, res) {
    console.log("Scraping...");   
    var articles = {};       
    axios.get("https://www.wsj.com/news/markets").then(function(response) {
        var $ = cheerio.load(response.data);
        $("h3.wsj-headline").each(function(i, element) {
            
            articles.title = $(this)
                .text();
            articles.link = $(this)
                .children("a")
                .attr("href");
            db.Article.create(articles)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.redirect("/");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    db.Article.find({})
    .sort({_id: -1})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });
});

app.get("/comments", function (req, res) {
    db.Comment.find({})
      .then(function (dbComment) {
        res.json(dbComment);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching on in our db.
    db.Article.findOne({ _id: req.params.id })
    // and populate all the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });
});

// Route for saving/upating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
    // Creates a new note and pass the req.body to the entry
    db.Comment.create(req.body)
    .then(function(dbComment) {
        // If a Comment was created successfully, find one Article with an '_id' equal to the 'req.params.id'. Update the Article to be associated with the new Comment
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which recieves the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, 
            { comment: dbComment._id}, 
            { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });
});

app.post("/comments/:id", function (req, res) {
    db.Comment.create(req.body)
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id },
          { note: dbComment._id },
          { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  
  app.delete("/comments/:id", function (req, res) {
    db.Comment.findByIdAndRemove({ _id: req.params.id })
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id },
          { note: dbComment._id });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    console.log("http://localhost:" + PORT);
  });
  