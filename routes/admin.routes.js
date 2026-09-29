const User = require("../models/User")

const router = require("express").Router()


router.get('/',(req,res)=>{
    res.render('admin/homepage.ejs')
})

router.get('/AllUser',async(req,res)=>{

const findAll= await User.find({role:'patient'})

res.render('admin/manageUser.ejs',{allUsers:findAll})

})


router.get('/AllUser/:id/edit',async(req,res)=>{

    const foundOne = await User.findById(req.params.id)

    res.render('admin/updateUser.ejs',{user:foundOne})
})

router.delete('/AllUser/:id',async(req,res)=>{

 

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

module.exports = router;
