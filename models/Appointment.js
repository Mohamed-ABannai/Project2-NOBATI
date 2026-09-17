const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  appointmentDate: {
    type: Date,
    required: true
  },

  appointmentTime: {
    type: String,
    required: true
  },

  reason: {
    type: String
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true })


const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment