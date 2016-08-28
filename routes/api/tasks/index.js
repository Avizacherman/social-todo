var express = require('express')
var router = express.Router()
var authenticator = require('../../../lib/authenticator')

var Task = require('../../../models/task')

router.user(authenticator)

router.get('/')
router.get('/users', (req, res) =>{

})

router.get('/users/:status', (req, res) =>{

})


module.exports = router
