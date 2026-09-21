const router = require("express").Router()
const Department=require('../models/Department')


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


router.get('/',async(req,res)=>{

const allDepartment=await Department.find()
res.render('departments/allDepartments.ejs',{allDep:allDepartment})

})



module.exports = router;