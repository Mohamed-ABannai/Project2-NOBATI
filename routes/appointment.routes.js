const router = require("express").Router()
const Appointment = require("../models/Appointment")
const { isPatient } = require("../middleware/is-signed-in")
const Doctor = require("../models/Doctor")
const Department = require("../models/Department")

router.get('/', isPatient, async (req, res) => {

    const appointments = await Appointment.find({
        patient: req.session.user._id
    }).populate('doctor')

    res.render('appointments/allAppointments.ejs', { appointments: appointments })
})

router.get('/new', isPatient, async (req, res) => {

    const generalDepartment = await Department.findOne({
        name: 'General Medicine'
    })

    const doctors = await Doctor.find({
        department: generalDepartment._id,
        isActive: true
    }).populate('user')

    res.render('appointments/createAppointments.ejs', { doctors })
})


router.post('/new',isPatient,async(req,res)=>{

    const {
        doctor,
        appointmentDate,
        appointmentTime,
        reason
    } = req.body

    const newAppointment = await Appointment.create({
        patient:req.session.user._id,
        doctor,
        appointmentDate,
        appointmentTime,
        reason
    })

    res.redirect('/appointment')
})

module.exports = router;
