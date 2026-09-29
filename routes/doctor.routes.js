const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { isSignedIn, isDoctor, isAdmin } = require("../middleware/is-signed-in");
const router = require("express").Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/',isDoctor,async(req,res)=>{
    res.render('doctors/homepage.ejs')
})

router.get('/new',isAdmin,async(req,res)=>{
    try{
        const departments=await Department.find()
        res.render('doctors/createDoctor.ejs',{departments:departments})
    }catch(err){
        console.log(err)
    }
})

router.post('/new',isAdmin,upload.single("image"),async(req,res)=>{
    try{
        const hashedPassword=bcrypt.hashSync(req.body.password,10)
        const newUser=await User.create({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
            role:"doctor",
            phone:req.body.phone
        })
        console.log(newUser)

        const addDoctor=await Doctor.create({
            user:newUser._id,
            specialization:req.body.specialization,
            department:req.body.department,
            consultationFee:req.body.consultationFee,
            bio:req.body.bio,
            image:{
                data:req.file.buffer,
                contentType:req.file.mimetype
            }
        })
        console.log(addDoctor)
        res.redirect('/doctor/allDoctors')
    }catch(err){
        console.log(err)
    }
})

router.get('/allDoctors',isSignedIn,async(req,res)=>{
    try{
        const foundDoctors=await Doctor.find({isActive:true})
            .populate('user')
            .populate('department')
        res.render('doctors/allDoctors.ejs',{doctors:foundDoctors})
    }catch(err){
        console.log(err)
    }
})

router.get('/edit',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({
            user:req.session.user._id
        }).populate('user').populate('department')
        res.render('doctors/updateProfile.ejs',{doctor:doctor})
    }catch(err){
        console.log(err)
    }
})

router.put('/profile',isDoctor,upload.single('image'),async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})

        const userUpdate={
            username:req.body.username,
            email:req.body.email,
            phone:req.body.phone
        }

        const doctorUpdate={
            specialization:req.body.specialization,
            consultationFee:req.body.consultationFee,
            bio:req.body.bio
        }

        if(req.file){
            doctorUpdate.image={
                data:req.file.buffer,
                contentType:req.file.mimetype
            }
        }

        const foundUser=await User.findByIdAndUpdate(req.session.user._id,userUpdate)
        console.log(foundUser)

        const foundDoctor=await Doctor.findByIdAndUpdate(doctor._id,doctorUpdate)
        console.log(foundDoctor)

        req.session.user.username=req.body.username
        res.redirect('/doctor/edit')
    }catch(err){
        console.log(err)
    }
})

router.get('/appointments',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})
        const appointments=await Appointment.find({
            doctor:doctor._id
        }).populate('patient')

        res.render('doctors/appointments.ejs',{appointments:appointments})
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id/confirm',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})
        const foundAppointment=await Appointment.findOneAndUpdate(
            {_id:req.params.id,doctor:doctor._id,status:'pending'},
            {status:'confirmed'}
        )
        console.log(foundAppointment)
        res.redirect('/doctor/appointments')
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id/cancel',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})
        const foundAppointment=await Appointment.findOneAndUpdate(
            {_id:req.params.id,doctor:doctor._id},
            {status:'cancelled'}
        )
        console.log(foundAppointment)
        res.redirect('/doctor/appointments')
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id/complete',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})
        const foundAppointment=await Appointment.findOneAndUpdate(
            {_id:req.params.id,doctor:doctor._id,status:'confirmed'},
            {status:'completed'}
        )
        console.log(foundAppointment)
        res.redirect('/doctor/appointments')
    }catch(err){
        console.log(err)
    }
})

router.get('/appointments/:id/redirect',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})
        const appointment=await Appointment.findOne({
            _id:req.params.id,
            doctor:doctor._id,
            status:'completed'
        }).populate('patient')

        const doctors=await Doctor.find({isActive:true})
            .populate('user')
            .populate('department')

        res.render('doctors/redirectAppointment.ejs',{
            appointment:appointment,
            doctors:doctors
        })
    }catch(err){
        console.log(err)
    }
})

router.put('/appointments/:id/redirect',isDoctor,async(req,res)=>{
    try{
        const doctor=await Doctor.findOne({user:req.session.user._id})

        const appointmentUpdate={
            doctor:req.body.doctor,
            appointmentDate:req.body.appointmentDate,
            appointmentTime:req.body.appointmentTime,
            status:'pending'
        }

        const foundAppointment=await Appointment.findOneAndUpdate(
            {_id:req.params.id,doctor:doctor._id,status:'completed'},
            appointmentUpdate
        )
        console.log(foundAppointment)
        res.redirect('/doctor/appointments')
    }catch(err){
        console.log(err)
    }
})

router.get('/:id/edit',isAdmin,async(req,res)=>{
    try{
        const foundone=await Doctor.findById(req.params.id)
            .populate('user')
            .populate('department')
        const departments=await Department.find()

        res.render('doctors/updateDoctor.ejs',{
            doctor:foundone,
            departments:departments
        })
    }catch(err){
        console.log(err)
    }
})

router.put('/:id',isAdmin,upload.single('image'),async(req,res)=>{
    try{
        const foundDoctor=await Doctor.findById(req.params.id)

        if(!foundDoctor){
            return res.send('Doctor not found')
        }

        const {username,email,phone,specialization,department,consultationFee,bio}=req.body

        const userUpdate={username,email,phone}
        const doctorUpdate={specialization,department,consultationFee,bio}

        if(req.file){
            doctorUpdate.image={
                data:req.file.buffer,
                contentType:req.file.mimetype
            }
        }

        const foundUser=await User.findByIdAndUpdate(foundDoctor.user,userUpdate)
        console.log(foundUser)

        const updatedDoctor=await Doctor.findByIdAndUpdate(req.params.id,doctorUpdate)
        console.log(updatedDoctor)

        res.redirect('/doctor/allDoctors')
    }catch(err){
        console.log(err)
    }
})

router.delete('/:id',isAdmin,async(req,res)=>{
    try{
        const foundDoctor=await Doctor.findById(req.params.id)

        if(!foundDoctor){
            return res.send('Doctor not found')
        }

        const doctorUpdate={isActive:false}
        const userUpdate={isActive:false}

        const deletedDoctor=await Doctor.findByIdAndUpdate(req.params.id,doctorUpdate)
        console.log(deletedDoctor)

        const deletedUser=await User.findByIdAndUpdate(foundDoctor.user,userUpdate)
        console.log(deletedUser)

        res.redirect('/doctor/allDoctors')
    }catch(err){
        console.log(err)
    }
})

module.exports=router;