const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

router.get("/sign-up",(req,res)=>{
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up",async(req,res)=>{
    try{
        const userInDatabase=await User.findOne({username:req.body.username});

        if(userInDatabase){
            return res.send("Username already taken.");
        }

        if(req.body.password !== req.body.confirmPassword){
            return res.send("Password and Confirm Password must match");
        }

        const hashedPassword=bcrypt.hashSync(req.body.password,10);
        req.body.password=hashedPassword;

        const user=await User.create(req.body);
        console.log(user)

        res.redirect("/auth/sign-in");
    }catch(err){
        console.log(err)
    }
});

router.get("/sign-in",(req,res)=>{
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in",async(req,res)=>{
    try{
        const userInDatabase=await User.findOne({
            username:req.body.username
        });

        if(!userInDatabase){
            return res.send("Login failed. Please try again.");
        }

        if(!userInDatabase.isActive){
            return res.send("Your account is inactive.");
        }

        const validPassword=bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );

        if(!validPassword){
            return res.send("Login failed. Please try again.");
        }

        req.session.user={
            username:userInDatabase.username,
            _id:userInDatabase._id,
            role:userInDatabase.role
        };

        if(userInDatabase.role === "admin"){
            return res.redirect("/admin/");
        }

        if(userInDatabase.role === "doctor"){
            return res.redirect("/doctor/");
        }

        res.redirect("/");
    }catch(err){
        console.log(err)
    }
});

router.get("/sign-out",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
});

module.exports=router;