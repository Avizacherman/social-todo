var express = require('express')
var router = express.Router()

var Task = require('../../../../models/task')

router.get('/', (req, res) => {
  Task.findAll()
  .then(tasks => {
    res.json(tasks)
  })
  .catch(err => {
    res.json(err)
  })
})


router.get('/test', (req, res) => {
  Task.complete({id: 23}, "Make Lunch")
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    res.json(err)
  })
})

router.post('/', (req, res) => {

})

router.get('/:id', (req, res) => {
  Task.findById(req.params.id)
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    res.json(err)
  })
})

module.exports = router
