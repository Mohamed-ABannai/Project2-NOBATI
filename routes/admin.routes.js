const router = require("express").Router()


router.get('/',(req,res)=>{
    res.render('admin/homepage.ejs')
})



module.exports = router;
