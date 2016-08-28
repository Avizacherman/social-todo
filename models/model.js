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
    db.read(id, (err, result) => {
      if(err)
        reject(err)
      else {
        db.readLabels(result, (err, labels) => {
          if(err)
            reject(err)
          else if(labels.indexOf(this.label) > 0)
            reject({msg: `NODE WITH ID ${id} IS NOT A ${this.label}`})
          else
            resolve(result)
        })
      }
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
