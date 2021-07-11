const express = require('express')
const router = express.Router()
const todos = require('./modules/todos')
const home = require('./modules/home')

router.use('/', home)
router.use('/todos', todos)


module.exports = router