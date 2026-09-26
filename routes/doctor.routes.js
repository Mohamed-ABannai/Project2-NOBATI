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

    const foundDoctors = await Doctor.find().populate('user').populate('department')


    res.render('doctors/allDoctors.ejs',{doctors:foundDoctors})
})

module.exports = router;