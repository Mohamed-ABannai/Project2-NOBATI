const Doctor = require("../models/Doctor");
const { route } = require("./department.routes");

const router = require("express").Router()



router.get('/new',(req,res)=>{

    res.render('doctors/createDoctor.ejs')
})


router.post('/new',async(req,res)=>{

const addDoctor= await Doctor.create({


    
})


})

module.exports = router;
