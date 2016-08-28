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
          MERGE (t:Task {name: ${name}})<-[:DOES {complete: false, startedAt: ${moment()}}]-(u)
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

Task.findUsers = function(id, status){
  status = typeof status === 'undefined' ? "" : "d.complete = " + status
  return new Promise((resolve, reject) => {
    db.query(`
      MATCH (t:Task)<-[d:DOES]-(u:User)
      WHERE ID(t) = ${id} ${status}
      `)
  })
}

module.exports = Task
