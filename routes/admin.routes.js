const User = require("../models/User")
const {isAdmin}=require('../middleware/is-signed-in')
const router = require("express").Router()
const Appointment = require("../models/Appointment")

router.get('/',isAdmin,(req,res)=>{
    res.render('admin/homepage.ejs')
})

router.get('/AllUser',isAdmin,async(req,res)=>{
    try{
        const findAll=await User.find({role:'patient'})
        res.render('admin/manageUser.ejs',{allUsers:findAll})
    }catch(err){
        console.log(err)
    }
})

router.get('/AllUser/:id/edit',isAdmin,async(req,res)=>{
    try{
        const foundOne=await User.findById(req.params.id)
        res.render('admin/updateUser.ejs',{user:foundOne})
    }catch(err){
        console.log(err)
    }
})

router.delete('/AllUser/:id',isAdmin,async(req,res)=>{
    try{
        const foundOne=await User.findByIdAndUpdate(req.params.id,{isActive:false})
        console.log(foundOne)
        res.redirect('/admin/AllUser')
    }catch(err){
        console.log(err)
    }
})

router.put('/AllUser/:id',isAdmin,async(req,res)=>{
    try{
        const userUpdate={
            username:req.body.username,
            email:req.body.email,
            phone:req.body.phone,
            isActive:req.body.isActive
        }
        const foundOne=await User.findByIdAndUpdate(req.params.id,userUpdate)
        console.log(foundOne)
        res.redirect('/admin/AllUser')
    }catch(err){
        console.log(err)
    }
})

router.get('/appointments',isAdmin,async(req,res)=>{
    try{
        const appointments=await Appointment.find()
            .populate('patient')
            .populate('doctor')
        res.render('admin/allAppointments.ejs',{appointments:appointments})
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id/cancel',isAdmin,async(req,res)=>{
    try{
        const foundOne=await Appointment.findByIdAndUpdate(req.params.id,{status:'cancelled'})
        console.log(foundOne)
        res.redirect('/admin/appointments')
    }catch(err){
        console.log(err)
    }
})

router.get('/appointments/:id/edit',isAdmin,async(req,res)=>{
    try{
        const appointment=await Appointment.findById(req.params.id)
            .populate('patient')
            .populate('doctor')
        res.render('admin/updateAppointment.ejs',{appointment:appointment})
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id',isAdmin,async(req,res)=>{
    try{
        const appointmentUpdate={
            appointmentDate:req.body.appointmentDate
        }
        const foundAppointment=await Appointment.findByIdAndUpdate(req.params.id,appointmentUpdate)
        console.log(foundAppointment)
        res.redirect('/admin/appointments')
    }catch(err){
        console.log(err)
    }
})

module.exports=router