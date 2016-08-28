var express = require('express')
var router = express.Router()

var User = require('../models/user')

module.exports = function(passport){

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
      if(err)
        res.json(err)
      else if (!user)
        res.json({success: false})
      else {
       req.login(user, function(err){
         if(err)
           res.json(err)
         else
           res.json({success: true, user})
        })
      }
    })(req, res, next)
  })

  router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  router.post('/signup', (req, res, next) => {
    User.create(req.body)
    .then(user => {
      passport.authenticate('local', (err, user) => {
        res.json({success: true, msg: "Succesfully Created New User and Logged In"})
      })(req, res, next)
    })
    .catch(err => {
      console.log(err)
      res.json(err)
    })
  })

  return router
}
