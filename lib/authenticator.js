module.exports = function(req, res, next){
  if (!req.user)
    res.json({loggedOut: true, success: false, msg: "YOU MUST BE LOGGED IN"})
  else
    next()
}
