const router = require("express").Router()
const { isAdmin } = require("../middleware/is-signed-in")
const Department=require('../models/Department')

router.get('/create',isAdmin,(req,res)=>{
    res.render('./departments/createDepartment.ejs')
})

router.post('/create',isAdmin,async(req,res)=>{
    try{
        const createDep=await Department.create({
            name:req.body.name,
            description:req.body.description
        })
        console.log(createDep)
        res.redirect('/departments/create')
    }catch(err){
        console.log(err)
    }
})

router.get('/',async(req,res)=>{
    try{
        const allDepartment=await Department.find()
        res.render('departments/allDepartments.ejs',{allDep:allDepartment})
    }catch(err){
        console.log(err)
    }
})

router.get('/:id/edit',isAdmin,async(req,res)=>{
    try{
        const foundOne=await Department.findById(req.params.id)
        res.render('departments/updateDepartment.ejs',{oneDep:foundOne})
    }catch(err){
        console.log(err)
    }
})

router.delete('/:id',isAdmin,async(req,res)=>{
    try{
        const foundOne=await Department.findByIdAndDelete(req.params.id)
        console.log(foundOne)
        res.redirect('/departments/')
    }catch(err){
        console.log(err)
    }
})

router.put('/:id',isAdmin,async(req,res)=>{
    try{
        const {name,description}=req.body
        const foundOne=await Department.findByIdAndUpdate(req.params.id,{
            name,
            description
        })
        console.log(foundOne)
        res.redirect('/departments/')
    }catch(err){
        console.log(err)
    }
})

module.exports=router