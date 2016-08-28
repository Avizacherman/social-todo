var express = require('express')
var router = express.Router()

var User = require('../../../models/user')

var userTasks = require('./tasks/index.js')
var authenticator = require('../../../lib/authenticator')

router.use('/tasks', userTasks)
router.use(authenticator)

router.get('/', (req, res) => {
  User.findAll()
  .then( users => {
    res.json(users)
  })
  .catch(err => {
    res.json(err)
  })
})

router.put('/:id', (req, res) => {
  User.update(req.params.id, req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.json(err)
  })
})

router.get('/:id/tasks', (req, res) => {
  User.findById(req.params.id)
  .then( user => {
    res.json(user)
  })
  .catch( err => {
    res.json(err)
  })
})


router.get('/:id/tasks/incomplete', (req, res) => {
  User.findById(req.params.id)
  .then( user => {
    res.json(user)
  })
  .catch( err => {
    res.json(err)
  })
})

router.get('/:id/tasks/complete', (req, res) => {
  User.findById(req.params.id)
  .then( user => {
    res.json(user)
  })
  .catch( err => {
    res.json(err)
  })
})

module.exports = router
