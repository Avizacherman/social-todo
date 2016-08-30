var express = require('express')
var router = express.Router()
var authenticator = require('../../../lib/authenticator')

var Task = require('../../../models/task')

router.user(authenticator)

router.post('/', (req, res) => {

})

router.put('/edit/:taskid', (req, res) =>{

})

router.put('/complete/:complete/:taskid')

router.get('/:taskid/users', (req, res) => {
  Task.findWithOtherUsers(req.params.taskid, req.user.id)
})

router.get('/:taskid/:status/users', (req, res) => {
  Task.findWithOtherUsers(req.params.taskid, req.user.id, req.params.status)
})

router.get('/:taskid', (req, res) => {
  Task.findById(req.params.taskid)
  .then(task => {
    res.json(jsonWrapper.success(task, ""))
  })
  .catch(err => {
    res.json(jsonWrapper.failure(err, "Something went wrong"))
  })
})


module.exports = router
