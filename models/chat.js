const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    text:  {
        type: String,
        required: true
    },
    createdAt: { type: Date }
});

chatSchema.pre('save', function(next){
    //console.log('before save', this);
    var now = new Date();
    this.createdAt = now;
    next();
});

module.exports = mongoose.model('Chat', chatSchema);