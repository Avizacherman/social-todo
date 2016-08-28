var bcrypt = require('bcrypt-nodejs')
var db = require('../config/db')
var Model = require('./model')

const User = new Model('User')

function sanitize(user){
  delete user.password
  return user
}

User.create = function(user){
  return new Promise( (resolve, reject) => {
    try {
      var sanitizedUser = {
        name: user.name,
        password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null),
        email: user.email
      }
      for(var key in sanitizedUser){
        //this is intentional. checks the user object passed in for the required keys in the sanitizedUser
        //if any are missing it will throw an error. Allows for the user to be further extended with values
        if(typeof user[key] === 'undefined'){
          throw {msg: `ERR: ${key} MUST HAVE A VALUE`}
        }
      }
    }
    catch(err){
      reject(err)
    }
    //Check to see if this user exists already to prevent duplicats
    this.findOne({email: sanitizedUser.email})
    .then(user => {
      if(user){
        reject({msg: `USER WITH EMAIL ${sanitizedUser.email} ALREADY EXISTS`})
      } else {
        //save the sanitized user so only values we pass in get through as a form of whitelisting
        db.save(sanitizedUser, 'User', (err, user) => {
          if(err){
            reject(err)
          } else {
            this.id = user.id
            resolve(user)
          }
        })
      }
    })
  })
}

User.validate = function(email, password){
  return new Promise((resolve, reject) => {
    this.findOne({email})
    .then(user => {
      if(!user)
        resolve({success: false, msg: 'NO SUCH USER'})
      else if(!bcrypt.compareSync(password, user.password))
        resolve({success: false, msg: 'PASSWORD DOES NOT MATCH'})
      else
        resolve({success: true, user: sanitize(user)})
    })
    .catch(err => {
      reject(err)
    })
  })
}

User.getTasks = function(id, status){
  // if status is blank replace it with "" for use in the query, otherwise, add a search for the status
  status = typeof status === 'undefined' ? "" : "d.complete = " + status
  return new Promise((resolve, reject) => {
    // Cypher Query - Find the User who's id matches the inputed id, it's related tasks where
    // the relationship is of the type past in status (should be incomplete or complete) and
    // all the associated tasks, then return them all.
    db.query(`
    MATCH(u:User)-[d:DOES]->(t:Task)
    WHERE ID(u) = ${id} ${status}
    RETURN u, t, d
    `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}

User.getTask = function(id, task){
  return new Promise((resolve, reject) => {
    // Cypher Query - Find a sepcific task if (and only if) it's related to the user
    db.query(`
    MATCH(u:User)-[r]->(t:Task)
    WHERE ID(u) = ${id} AND t.name = "${task}"
    RETURN t, r
    `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}

module.exports = User
