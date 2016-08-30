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
  console.log(req.user)
  Task.create(req.user.id, req.body.name)
  .then(task => {
    res.json(successWrapper(task))
  })
  .catch(err => {
    res.json(failureWrapper(err))
  })
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
    res.json(successWrapper(task, ""))
  })
  .catch(err => {
    res.json(failureWrapper(err, "Something went wrong"))
  })
})


module.exports = router
