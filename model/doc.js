const mongoose = require('mongoose')

const DocSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'cannot upload empty name'],
        maxlength: [20, 'name can not be more than 20 characters'],
      },
      specialization: {
        type: String,
        required: true
      },
      years_of_experience: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      location: {
        type: {
          type: String, // 'type' is a key in MongoDB's GeoJSON format
          enum: ['Point'], // Only 'Point' type is allowed
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

module.exports = mongoose.model('Doc', DocSchema)