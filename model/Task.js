const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  Date : {
    type : String,
  },
  journal: {
    type: String,
    required: [true, 'cannot upload empty journal'],
    trim: true,
  },
})

module.exports = mongoose.model('Task', TaskSchema)