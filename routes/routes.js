const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {default:mongoose} = require('mongoose');
const USER = mongoose.model("USER");
const NOTE = mongoose.model("NOTEMODEL");

router.post('/signup', async(req,res)=>{
    try{
        const {email,password,confirmPassword}= req.body;

        if(password !== confirmPassword){
            return res.status(400).json({
                message:"Password not Matched"
            })
        }
        const presentUser = await USER.findOne({email})
        if(presentUser){
            return res.status(400).json({
                message:"User already Exist!"
            })
        }

        bcrypt.hash(password,10,async function(err,hash){
            if(err){
                return res.status(500).json({
                    status:"Failed",
                    message:err.message
                })
            }

            const hashedPassword = await USER.create({
                email,
                password:hash
            })
            res.status(201).json({
                message:"registered sucessfully"
            })
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message:err.message
        })
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await USER.findOne({email});

        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"user is not found please register first!"
            })
        }

        bcrypt.compare(password,user.password, function(err,result){
            if(err){
                return res.status(500).json({
                    status:"failed",
                    message:err.message
                })
            }
            if(result){
                const token = jwt.sign({
                    exp: Math.floor(Date.now()/1000) + (60*60),
                    data: user._id
                }, process.env.SECRET)

                res.status(201).json({
                    message:"login sucessfully",
                    token
                })
            }
            else{
                res.status(400).json({
                    status:"failed",
                    message:"invalid credantial!"
                })
            }
        })
    }catch(err){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})


module.exports = router;