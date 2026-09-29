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

module.exports = router;
