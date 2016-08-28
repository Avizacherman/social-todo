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
        MATCH (u:User) WHERE ID(u) = ${user.id}
        MATCH (t:Task {name: "${name}"})<-[d:DOES]-(u)
        SET d.complete = false
        REMOVE d.completedAt
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

Task.update = function(userId, taskId, newName){
  db.query(`
    MATCH (t:Task)<-[d:DOES]-(u:User)
    WHERE ID(u) = ${userId} AND ID(t) = ${taskId}
    MERGE (t2:Task {name: ${newName}})
    CREATE (u)-[d2:DOES]->(t2)
	  WITH d, d2, t2, u, t
    SET d2.complete = d.complete
	  SET d2.completedAt = d2.completedAt
	  DELETE d
    RETURN u, d2, t2
  `, (err, result) => {
    if(err)
      reject(err)
    else
      resolve(result)
  })
}

Task.findUsers = function(taskId, status){
  status = typeof status === 'undefined' ? "" : "d.complete = " + status
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (t:Task)<-[d:DOES]-(u:User)
      WHERE ID(t) = ${taskId} ${status}
      `)
  })
}

module.exports = Task
