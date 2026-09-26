const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({

 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  specialization: {
    type: String,
    required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
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
    data: Buffer,
    contentType: String
}

}, { timestamps: true })


const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor