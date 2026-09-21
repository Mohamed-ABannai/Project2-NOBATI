const router = require("express").Router()
const Department=require('../models/Department')

router.get('/',(req,res)=>{
    res.render('homepage.ejs')
})



router.get('/create',(req,res)=>{

res.render('./departments/createDepartment.ejs')

})

router.post('/create',async(req,res)=>{

const createDep= await Department.create({
    name:req.body.name,
    description:req.body.description
})
res.redirect('/departments/create')

})





module.exports = router;