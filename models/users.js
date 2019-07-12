const short_id = require('shortid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Users = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
    
  },
  
  _id: {
    type: String,
    required: true,
    default: short_id.generate    
  }
})

module.exports = mongoose.model('Users', Users)