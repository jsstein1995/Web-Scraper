var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//Creating a new NoteSchema Object
var CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});
//This cretes our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;