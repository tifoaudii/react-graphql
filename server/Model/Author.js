const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuthorSchema = new Schema({
  name: String,
  age: Number
});

module.exports = mongoose.model('Author', AuthorSchema);