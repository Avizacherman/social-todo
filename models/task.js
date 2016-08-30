var bcrypt = require('bcrypt-nodejs')
var db = require('../config/db')
var Model = require('./model')
var User = require('./user')
var moment = require('moment')

const Task = new Model('Task')

Task.create = function(userid, name){
  return new Promise((resolve, reject) => {
    User.findTask(userid, name)
    .then( result => {
      if(result.length > 0)
        reject({msg: "USER ALREADY HAS THIS TASK ON THEIR LIST"})
      else {
        db.query(`
          MATCH (u:User) WHERE ID(u) = ${userid}
          MERGE (task:Task {name: "${name}"})
          CREATE (task)<-[does:DOES {complete: false, startedAt: "${moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')}"}]-(u)
          RETURN task, does
          `, (err, result) => {
          if(err)
            reject(err)
          else
            resolve(result[0])
        })
      }
    })
  })
}

Task.complete = function(userid, taskid){
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (u:User)
      WHERE ID(u) = ${userid}
      MATCH (task:Task)<-[does:DOES]-(u)
      WHERE ID(task) = ${taskid}
      SET does.complete = true
      SET does.completedAt = "${moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')}"
      RETURN task, does
      `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}

Task.incomplete = function(userid, taskid){
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (user:User)
      WHERE ID(user) = ${userid}
      MATCH (task:Task)<-[does:DOES]-(user)
      WHERE ID(task) = ${taskid}
      SET does.complete = false
      REMOVE does.completedAt
      RETURN does, task
      `, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
    .catch(err => {
      reject(err)
    })
  })
}

Task.update = function(userId, taskId, newName){
  db.query(`
    MATCH (t:Task)<-[d:DOES]-(user:User)
    WHERE ID(u) = ${userId} AND ID(t) = ${taskId}
    MERGE (t2:Task {name: ${newName}})
    CREATE (u)-[does:DOES]->(task)
	  WITH d, does, task, user, t
    SET does.complete = d.complete
	  SET does.completedAt = d.completedAt
	  DELETE d
    RETURN does, task
  `, (err, result) => {
    if(err)
      reject(err)
    else
      resolve(result)
  })
}

Task.getWithOtherUsers = function(userId, taskId, status){
  status = typeof status === 'undefined' ? "" : "AND does.complete = " + status
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (u:User)-[youDid:DOES]->(task:Task)
      WHERE ID(task) = ${taskId} AND ID(u) = ${userId} ${status}
      WITH u, task, youDid
      OPTIONAL MATCH (u)-[youDid:DOES]-(task)<-[does:DOES]-(user:User)
      RETURN task, does, user, youDid
      `, (err, result) => {
      if(err){
      console.log(err)
        reject(err)
      }
      else
        resolve(result)
    })
  })
}

module.exports = Task
