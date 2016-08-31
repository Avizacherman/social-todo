var bcrypt = require('bcrypt-nodejs')
var db = require('../config/db')
var Model = require('./model')

const User = new Model('User')
//
// function sanitize(user){
//   delete user.password
//   return user
// }

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
    // There are no migration files for neo4j (which makes it a little tricky)
    // However, a unique constraint was set on the User label, forcing emails to be unique
    db.save(sanitizedUser, 'User', (err, user) => {
      if(err)
        reject(err)
      else {
        this.id = user.id
        resolve(user)
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
        resolve({success: true, user})
    })
    .catch(err => {
      reject(err)
    })
  })
}

User.getTasks = function(userid, status){
  // if status is blank replace it with "" for use in the query, otherwise, add a search for the status
  status = typeof status === 'undefined' ? "" : "AND d.complete = " + status
  return new Promise((resolve, reject) => {
    // Cypher Query - Find the User who's id matches the inputed id, it's related tasks where
    // the relationship is of the type past in status (should be incomplete or complete) and
    // all the associated tasks, then return them all.
    db.query(`
    MATCH(self:User)-[does:DOES]->(task:Task)
    WHERE ID(self) = ${userid} ${status}
    RETURN task, does, self
    `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}

User.getTask = function(userid, taskid){
  return new Promise((resolve, reject) => {
    // Cypher Query - Find a sepcific task if (and only if) it's related to the user
    db.query(`
    MATCH(u:User)-[does:DOES]->(task:Task)
    WHERE ID(u) = ${userid} AND ID(task) = "${taskid}"
    RETURN task, does
    `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}

User.findTask = function(userid, taskName){
  return new Promise((resolve, reject) => {
    // Cypher Query - Find a sepcific task if (and only if) it's related to the user
    db.query(`
    MATCH(u:User)-[does:DOES]->(task:Task)
    WHERE ID(u) = ${userid} AND task.name = "${taskName}"
    RETURN task, does
    `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}


module.exports = User
