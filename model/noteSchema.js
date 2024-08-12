const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AddNote = new Schema({
    user:{type:ObjectId, ref:"USER"},
    title:{type:String},
    description:{type:String}
});

AddNote.set('timestamps', true);
mongoose.model('NOTEMODEL', AddNote);