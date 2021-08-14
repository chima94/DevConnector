const express = require('express')
const router = express()

//@route GET api/Posts
//desc  Test route
//Access Public
router.get('/', (req, res) =>{
    res.send('Posts route')
})

module.exports = router