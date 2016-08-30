var bcrypt = require('bcrypt-nodejs')
var db = require('../config/db')
var Model = require('./model')
var User = require('./user')
var moment = require('moment')

const Task = new Model('Task')

Task.create = function(user, name){
  return new Promise((resolve, reject) => {
    User.getTask(user.id, name)
    .then( result => {
      if(result)
        reject({msg: "USER ALREADY HAS THIS TASK ON THEIR LIST"})
      else {
        db.query(`
          MATCH (u:User) WHERE ID(u) = ${user.id}
          MERGE (t:Task {name: ${name}})
          CREATE (t)<-[:DOES {complete: false, startedAt: ${moment()}}]-(u)
          RETURN t
          `, (err, result) => {
          if(err)
            reject(err)
          else
            resolve(result)
        })
      }
    })
    .catch(err => {
      reject(err)
    })
  })
}

Task.complete = function(user, name){
  return new Promise((resolve, reject) => {
    User.getTask(user.id, name)
    .then(result => {
      db.query(`
        MATCH (u:User) WHERE ID(u) = ${user.id}
        MATCH (t:Task {name: "${name}"})<-[d:DOES]-(u)
        SET d.complete = true AND d.completedAt = ${moment()}
        RETURN u,t,d
        `, (err, result) => {
        if(err)
          reject(err)
        else
          resolve(result)
      })
    })
    .catch(err => {
      reject(err)
    })
  })
}

Task.incomplete = function(user, name){
  return new Promise((resolve, reject) => {
    User.getTask(user.id, name)
    .then(result => {
      db.query(`
        MATCH (user:User) WHERE ID(user) = ${user.id}
        MATCH (task:Task {name: "${name}"})<-[does:DOES]-(user)
        SET does.complete = false
        REMOVE does.completedAt
        RETURN user, does, task
        `, (err, result) => {
        if(err)
          reject(err)
        else
          resolve(result)
      })
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
    RETURN user, does, task
  `, (err, result) => {
    if(err)
      reject(err)
    else
      resolve(result)
  })
}

Task.findWithOtherUsers = function(userId, taskId, status){
  status = typeof status === 'undefined' ? "" : "AND d.complete = " + status
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (u:User)-[:DOES]->(t:Task)<-[d:DOES]-(users:Users)
      WHERE ID(t) = ${taskId} AND ID(u) = ${userId} ${status}
      RETURN users, task, does
      `)
  })
}

module.exports = Task
