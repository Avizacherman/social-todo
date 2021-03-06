var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

function sanitize(user){
  delete user.password
  return user
}

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id).then( user => {
      done(null, sanitize(user))
    })
  })

  passport.use(new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.validate(email, password)
      .then( auth => {
        if(!auth.success)
           done(null, false)
        else
           done(null, auth.user)
      })
      .catch(err => {
        done(err, false)
      })
  }))
}
