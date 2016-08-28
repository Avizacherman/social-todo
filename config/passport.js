var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')



module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
    return null
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      done(null, user)
      return null
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
        console.log(auth)
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
