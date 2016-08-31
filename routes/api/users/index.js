var express = require('express')
var router = express.Router()

var User = require('../../../models/user')
var Task = require('../../../models/task')

var authenticator = require('../../../lib/authenticator')

function failureWrapper(response, msg){
  return {data: response, msg, success: false}
}

function successWrapper(response, msg){
  return {data: response, msg, success: true}
}


router.use(authenticator)

router.get('/', (req, res) => {

})

router.get('/tasks', (req, res) => {
  User.getTasks(req.user.id)
  .then(tasks => {
    res.json(successWrapper(tasks, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})

router.put('/:userid', (req, res) => {
  User.update(req.params.userid, req.body)
  .then(user => {
    res.json(successWrapper(user, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})

router.get('/:userid/tasks', (req, res) => {
  User.getTasks(req.params.userid)
  .then(tasks => {
    res.json(successWrapper(tasks, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})


router.get('/:userid/tasks/complete', (req, res) => {
  User.getTasks(req.params.userid, true)
  .then(tasks => {
    res.json(successWrapper(tasks, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})

router.get('/:userid/tasks/incomplete', (req, res) => {
  User.getTasks(req.params.userid, false)
  .then(task => {
    res.json(successWrapper(task, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})

router.get('/:userid/task/:taskid/users', (req, res) => {
  Task.getWithOtherUsers(req.params.userid, req.params.taskid)
  .then(tasks => {
    res.json(successWrapper(tasks))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
})

router.get('/:userid/task/:taskid', (req, res) => {
  User.getTask()
  .then(tasks => {
    res.json(successWrapper(task, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})


router.get('/:userid', (req, res) => {
  User.findById(req.params.userid)
  .then(user => {
    res.json(successWrapper(user, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})

module.exports = router
