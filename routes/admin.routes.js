const User = require("../models/User")
const {isAdmin}=require('../middleware/is-signed-in')
const router = require("express").Router()
const Appointment = require("../models/Appointment")

router.get('/',(req,res)=>{
    res.render('admin/homepage.ejs')
})

router.get('/AllUser',async(req,res)=>{

const findAll= await User.find({role:'patient'})

res.render('admin/manageUser.ejs',{allUsers:findAll})

})


router.get('/AllUser/:id/edit',isAdmin,async(req,res)=>{

    const foundOne = await User.findById(req.params.id)

    res.render('admin/updateUser.ejs',{user:foundOne})
})

router.delete('/AllUser/:id',isAdmin,async(req,res)=>{

 

   const foundOne= await User.findByIdAndUpdate(req.params.id,{isActive:false})

    res.redirect('/admin/AllUser')
})

router.put('/AllUser/:id',async(req,res)=>{

    const userUpdate = {
        username:req.body.username,
        email:req.body.email,
        phone:req.body.phone,
        isActive:req.body.isActive
    }

   const foundone= await User.findByIdAndUpdate(req.params.id,userUpdate)

    res.redirect('/admin/AllUser')
})

router.get('/appointments',isAdmin,async(req,res)=>{

    const appointments = await Appointment.find()
        .populate('patient')
        .populate('doctor')

    res.render('admin/allAppointments.ejs',{
        appointments:appointments
    })
})

router.put('/appointments/:id/cancel',isAdmin,async(req,res)=>{

   const foundOne= await Appointment.findByIdAndUpdate(req.params.id,{status:'cancelled'}
    )

    res.redirect('/admin/appointments')
})

router.get('/appointments/:id/edit',isAdmin,async(req,res)=>{

    const appointment = await Appointment.findById(req.params.id)
        .populate('patient')
        .populate('doctor')

    res.render('admin/updateAppointment.ejs',{
        appointment:appointment
    })
})

router.put('/appointments/:id',isAdmin,async(req,res)=>{

    const appointmentUpdate = {
        appointmentDate:req.body.appointmentDate
    }

    await Appointment.findByIdAndUpdate(req.params.id,appointmentUpdate
    )

    res.redirect('/admin/appointments')
})

module.exports = router;
