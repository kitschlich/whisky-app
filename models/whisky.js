var mongoose = require('mongoose');
var WhiskySchema = new mongoose.Schema({
    author: {
      type: String,
      required: true
    },
    attributes: {
      name: {
        type: String,
        required: true
      },
      style: String,
      proof: Number,
      age: Number,
      price: Number,
      bottle_size: Number,
      pour_size: Number,
      nose: [String],
      flavor: [String],
      finish: [String],
      score: Number,
      establishment: String,
      date: Date
    }
});

var Whisky = mongoose.model('Whisky', WhiskySchema);

module.exports = Whisky;
