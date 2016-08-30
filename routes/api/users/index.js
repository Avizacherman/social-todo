var express = require('express')
var router = express.Router()

var User = require('../../../models/user')

var jsonWrapper = ('../lib/jsonWrapper')
var authenticator = require('../../../lib/authenticator')

router.use(authenticator)

router.put('/:userid', (req, res) => {
  User.update(req.params.userid, req.body)
  .then(user => {
    res.json(jsonWrapper.success(user, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})

router.get('/:userid/tasks', (req, res) => {
  User.getTasks(req.params.userid)
  .then(tasks => {
    res.json(jsonWrapper.success(task, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})

router.get('/:userid/tasks/complete', (req, res) => {
  User.getTasks(req.params.userid, true)
  .then(tasks => {
    res.json(jsonWrapper.success(tasks, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})

router.get('/:userid/tasks/incomplete', (req, res) => {
  User.getTasks(req.params.userid, false)
  .then(task => {
    res.json(jsonWrapper.success(task, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})

router.get('/:userid/task/:taskid', (req, res) => {
  User.getTask()
  .then(tasks => {
    res.json(jsonWrapper.success(task, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})

router.get('/tasks', (req, res) => {
  User.getTasks(req.user.id)
  .then(tasks => {
    res.json(jsonWrapper.success(task, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})


module.exports = router
