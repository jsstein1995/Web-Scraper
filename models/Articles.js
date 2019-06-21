var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Create new UserSchema object
var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    image:  {
        type: String
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

//This creates our model from the above shema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;