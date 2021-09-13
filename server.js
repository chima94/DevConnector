const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express()

//connect to database
connectDB()

//init middleware
app.use(express.json({extended: false}))



//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profiles', require('./routes/api/profiles'))
app.use('/api/auth', require('./routes/api/auth'))

//serve static asset in production
if(process.env.NODE_ENV === 'production'){
    //set the static folder
    app.use(express.static('client/build'))
    
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{
    console.log(`Server Started on port ${PORT}`)
})
