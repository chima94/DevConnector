const express = require('express')
const router = express()

//@route GET api/Profile
//desc  Test route
//Access Public
router.get('/', (req, res) =>{
    res.send('Profile route')
})

module.exports = router