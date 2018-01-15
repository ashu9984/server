//These routes will be used for registration and Login , here
// we would register the user and authenticate the user and generate the token
// the token will be supplied to the user.`

var express = require('express');
var registrationLogin = express.Router();
var mongoose = require('mongoose');

var mongojs=require('mongojs');
var user = require('../models/user')
var jwt = require('jsonwebtoken');
var superSecret = require('../config')

registrationLogin.post('/registration', function (req, res) {
  if (!req.body.email || !req.body.password || !req.body.fname || !req.body.fname || !req.body.lname || !req.body.cpass) {
        res.json({
            success: false,
            msg: " no data entered"
        })
    } else {
       var userSave = new user({
      fname: req.body.fname,
      lname: req.body.lname,
      
      email: req.body.email,
      password: req.body.password,
      
      
      
    })
        user.findOne({ email: req.body.email}, (err, lData) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Database error"
                })

            } 
            else if(req.body.password!==req.body.cpass){
                res.json({
                    success: false,
                    msg: "passwor not match",})
            }else if (lData != null || lData) {
                res.json({
                    success: false,
                    msg: "this Email already registered"
                })
            } else {
                userSave.save((err, savedData) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Database Error"
                        })
                    } else 
                        
                            res.json({
                                success: true,
                                msg: " Registered",
                                
                            })
                        
                       
                    
                })
            }
        })
        
        
    }
})

  
          

registrationLogin.post('/login', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      msg: "No data entered"
    })
  } else {
    user.findOne({
      email: req.body.email
    }, function (err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, superSecret.secret, {
            expiresIn: 86400 // expires in 24 hours
          });

          res.json({
            success: true,
            message: "login Done",
            token: token
          });
        }

      }

    })
  }
})


registrationLogin.get('/getAll', function (req, res) {

      
       
 	user.find(function(err,args)
 	{
 		console.log(args);
 		 res.json(args);


 	})

    });
    
    registrationLogin.delete('/deleteuser/:id',function(req, res){
        
            var id =req.params.id;
            console.log(id);
            user.remove({_id: mongojs.ObjectId(id)} , function(err,args)
            {
                res.json(args);
        
            })
            console.log("delete api call");
        })
  
  

        registrationLogin.get('/get/:id',function(req,res)
        {
             var id = req.params.id;
        
             user.findOne({_id: mongojs.ObjectId(id)} , function(err,args)
            {
                res.json(args);
        
            })
        
           
            console.log("edit get api call");
        
        
        });
module.exports = registrationLogin;
