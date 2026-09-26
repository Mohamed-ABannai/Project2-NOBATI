const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Department = require("../models/Department");
const bcrypt = require("bcrypt");
const multer = require("multer");

const router = require("express").Router()

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.get('/',async(req,res)=>{

    res.render('doctors/homepage.ejs')
})


router.get('/new',async(req,res)=>{

    const departments = await Department.find()

    res.render('doctors/createDoctor.ejs',{departments:departments})
})


router.post('/new',upload.single("image"),async(req,res)=>{

    const hashedPassword = bcrypt.hashSync("",10)

     const newUser = await User.create({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        role:"doctor",
        phone:req.body.phone
    })

    const addDoctor = await Doctor.create({
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

    res.redirect('/doctor/')
})

router.get('/allDoctors',async(req,res)=>{

    const foundDoctors = await Doctor.find({isActive:true}).populate('user').populate('department')


    res.render('doctors/allDoctors.ejs',{doctors:foundDoctors})
})

router.get('/:id/edit',async(req,res)=>{

    const foundone = await Doctor.findById(req.params.id).populate('user').populate('department')

    const departments = await Department.find()

    res.render('doctors/updateDoctor.ejs',{
        doctor:foundone,
        departments:departments
    })
})

router.put('/:id',upload.single('image'),async(req,res)=>{

    const foundDoctor = await Doctor.findById(req.params.id)

    if(!foundDoctor){
        return res.send('Doctor not found')
    }

    const {
        username,
        email,
        phone,
        specialization,
        department,
        consultationFee,
        bio
    } = req.body

    const userUpdate = {
        username,
        email,
        phone
    }

    const doctorUpdate = {
        specialization,
        department,
        consultationFee,
        bio
    }

    if(req.file){
        doctorUpdate.image = {
            data:req.file.buffer,
            contentType:req.file.mimetype
        }
    }

    await User.findByIdAndUpdate(foundDoctor.user,userUpdate)

    await Doctor.findByIdAndUpdate(req.params.id,doctorUpdate)

    res.redirect('/doctor/allDoctors')
})



router.delete('/:id',async(req,res)=>{

    const foundDoctor = await Doctor.findById(req.params.id)

    if(!foundDoctor){
        return res.send('Doctor not found')
    }

    const doctorUpdate = {
        isActive:false
    }

    const userUpdate = {
        isActive:false
    }

    await Doctor.findByIdAndUpdate(req.params.id,doctorUpdate)

    await User.findByIdAndUpdate(foundDoctor.user,userUpdate)

    res.redirect('/doctor/allDoctors')
})



module.exports = router;