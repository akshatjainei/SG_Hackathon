const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  Date : {
    type : String,
  },
  journal: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
})

module.exports = mongoose.model('Task', TaskSchema)