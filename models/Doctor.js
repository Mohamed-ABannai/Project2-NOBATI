const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },

  consultationFee: {
    type: Number,
    required: true
  },

  bio: {
    type: String
  },

  image: {
    type: String
  }

}, { timestamps: true })


const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor