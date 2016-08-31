var express = require('express')
var router = express.Router()

var User = require('../models/user')

function failureWrapper(response, msg){
  return {data: response, msg, success: false}
}

function successWrapper(response, msg){
  return {data: response, msg, success: true}
}


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

  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  router.post('/signup', (req, res, next) => {
    User.create(req.body)
    .then(user => {
      passport.authenticate('local', (err, user) => {
        if(err)
          res.json(failureWrapper(err, "Unable to log in"))
        else {
          console.log(user)
          req.login(user, (err) => {
            console.log(user)
            if(err)
              res.json(failureWrapper(err, "Unable to log in"))
            else
              res.json(successWrapper(user, "Succesfully logged in"))
          })
        }
      })(req, res, next)
    })
    .catch(err => {
      res.json(failureWrapper(err, "Unable to log in"))
    })
  })

  return router
}
