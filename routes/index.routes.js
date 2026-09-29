const router = require("express").Router()


router.get('/',(req,res)=>{

    if(!req.session.user){
        return res.render('homepage.ejs')
    }

    if(req.session.user.role === 'patient'){
        return res.render('homepage.ejs')
    }

    if(req.session.user.role === 'doctor'){
        return res.redirect('/doctor')
    }

    if(req.session.user.role === 'admin'){
        return res.redirect('/admin')
    }

})
module.exports = router;
