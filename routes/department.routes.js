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

router.get('/:id/edit',async(req,res)=>{

const foundOne= await Department.findById(req.params.id,)

res.render('departments/updateDepartment.ejs',{oneDep:foundOne})
})

router.delete('/:id',async(req,res)=>{

    const foundOne=await Department.findByIdAndDelete(req.params.id)
    res.redirect('/departments/')

})

router.put('/:id',async(req,res)=>{

    const { name, description } = req.body
    const foundOne=await Department.findByIdAndUpdate(req.params.id,{
        name,
        description
    })

    res.redirect('/departments/')
})


module.exports = router;