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

    res.render('appointments/createAppointments.ejs', { doctors:doctors })
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


router.put('/:id/cancel',isPatient,async(req,res)=>{

    

   const foundAppointment =await Appointment.findByIdAndUpdate(
        req.params.id,{
        status:'cancelled'}
    )

    res.redirect('/appointment')
})


router.get('/:id/edit',isPatient,async(req,res)=>{

    const appointment = await Appointment.findById(req.params.id)

    const department = await Department.findOne({name:'General Medicine'})

    const doctors = await Doctor.find({department:department._id,
        isActive:true
    }).populate('user')

    res.render('appointments/updateAppointment.ejs',{appointment:appointment,
        doctors:doctors
    })
})



router.put('/:id',async(req,res)=>{

    const appointmentUpdate = {
        doctor:req.body.doctor,
        appointmentDate:req.body.appointmentDate,
        appointmentTime:req.body.appointmentTime,
        reason:req.body.reason
    }

    const foundOne =await Appointment.findByIdAndUpdate(req.params.id,appointmentUpdate)

    res.redirect('/appointment')
})

module.exports = router;
