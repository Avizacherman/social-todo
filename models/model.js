var db = require('../config/db')
var _ = require('lodash')

const Model = function(label){
  this.label = label
}

Model.prototype.findOne = function(searchObj){
  return new Promise( (resolve, reject) => {
    db.find(searchObj, this.label, (err, result) => {
      if(err)
        reject(err)
      else if(result.length === 0)
        resolve(undefined)
      else
        resolve(result[0])
    })
  })
}

Model.prototype.findById = function(id){
  return new Promise( (resolve, reject) => {
    db.query(`MATCH (${this.label.toLowerCase()}) WHERE ID(${this.label.toLowerCase()}) = ${id} RETURN ${this.label.toLowerCase()}`, (err, result) =>{
      if(err)
        reject(err)
      else
        resolve(result[0])
    })
  })
}

Model.prototype.findAll = function(){
  return new Promise( (resolve, reject) => {
    db.nodesWithLabel(this.label, (err, result) => {
      if(err)
        reject(err)
      else
        resolve(result)
    })
  })
}


module.exports = Model
