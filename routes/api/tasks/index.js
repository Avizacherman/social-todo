var express = require('express')
var router = express.Router()
var authenticator = require('../../../lib/authenticator')

var Task = require('../../../models/task')

function failureWrapper(response, msg){
  return {data: response, msg, success: false}
}

function successWrapper(response, msg){
  return {data: response, msg, success: true}
}

router.use(authenticator)

router.post('/', (req, res) => {
  Task.create(req.user.id, req.body.name)
  .then(task => {
    res.json(successWrapper(task))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.put('/edit/:taskid', (req, res) =>{
  Task.update(req.user.id, req.params.taskid, req.body.newName)
  .then(task => {
    res.json(successWrapper(task))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.put('/complete/:status', (req, res) => {
  if(req.params.status === 'true'){
    var taskPromise = Task.complete(req.user.id, req.body.taskid)
  } else {
    var taskPromise = Task.incomplete(req.user.id, req.body.taskid)
  }
  taskPromise.then(task => {
    res.json(successWrapper(task))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.get('/:taskid/users', (req, res) => {
  Task.getWithOtherUsers(req.user.id, req.params.taskid)
  .then(tasks => {
    res.json(successWrapper(tasks))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.get('/:taskid/complete/:status/users', (req, res) => {
  Task.getWithOtherUsers(req.user.id, req.params.taskid, req.params.status)
  .then(tasks => {
    res.json(successWrapper(tasks))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.get('/:taskid', (req, res) => {
  Task.findById(req.params.taskid)
  .then(task => {
    res.json(successWrapper(task, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})


module.exports = router
