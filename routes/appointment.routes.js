const router = require("express").Router()
const Appointment = require("../models/Appointment")
const { isPatient } = require("../middleware/is-signed-in")
const Doctor = require("../models/Doctor")
const Department = require("../models/Department")

router.get('/',isPatient,async(req,res)=>{
    try{
        const appointments=await Appointment.find({
            patient:req.session.user._id
        }).populate({
            path:'doctor',
            populate:['user','department']
        })
        res.render('appointments/allAppointments.ejs',{appointments:appointments})
    }catch(err){
        console.log(err)
    }
})

router.get('/new',isPatient,async(req,res)=>{
    try{
        const generalDepartment=await Department.findOne({name:'General Medicine'})
        const doctors=await Doctor.find({
            department:generalDepartment._id,
            isActive:true
        }).populate('user')
        res.render('appointments/createAppointments.ejs',{doctors:doctors})
    }catch(err){
        console.log(err)
    }
})

router.post('/new',isPatient,async(req,res)=>{
    try{
        const {doctor,appointmentDate,appointmentTime,reason}=req.body
        const newAppointment=await Appointment.create({
            patient:req.session.user._id,
            doctor,
            appointmentDate,
            appointmentTime,
            reason
        })
        console.log(newAppointment)
        res.redirect('/appointment')
    }catch(err){
        console.log(err)
    }
})

router.put('/:id/cancel',isPatient,async(req,res)=>{
    try{
        const foundAppointment=await Appointment.findByIdAndUpdate(
            req.params.id,{status:'cancelled'}
        )
        console.log(foundAppointment)
        res.redirect('/appointment')
    }catch(err){
        console.log(err)
    }
})

router.get('/:id/edit',isPatient,async(req,res)=>{
    try{
        const appointment=await Appointment.findById(req.params.id)
        const department=await Department.findOne({name:'General Medicine'})
        const doctors=await Doctor.find({
            department:department._id,
            isActive:true
        }).populate('user').populate('department')
        res.render('appointments/updateAppointment.ejs',{
            appointment:appointment,
            doctors:doctors
        })
    }catch(err){
        console.log(err)
    }
})

router.put('/:id',isPatient,async(req,res)=>{
    try{
        const appointmentUpdate={
            doctor:req.body.doctor,
            appointmentDate:req.body.appointmentDate,
            appointmentTime:req.body.appointmentTime,
            reason:req.body.reason
        }
        const foundOne=await Appointment.findByIdAndUpdate(req.params.id,appointmentUpdate)
        console.log(foundOne)
        res.redirect('/appointment')
    }catch(err){
        console.log(err)
    }
})

module.exports=router