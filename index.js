const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const Users = require('./models/users')
const Exercises = require('./models/exercises')

const mongoose = require('mongoose')

require('dotenv').config()

//mongoose.connect('mongodb://localhost:27017/exercise_tracker', { useNewUrlParser: true })

mongoose.connect(process.env.MLAB_URI, { useNewUrlParser: true })

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create a new user
app.post('/api/exercise/new-user', (req, res, next) => {
    const user = new Users(req.body);
    user.save((err, savedUser) => {
      if(err) {
        if(err.code === 11000) {
          return next({
            status: 400,
            message: 'username already taken'
            })
        } else{
          return next(err)
        }
      }
      
      res.json({
        username: savedUser.username,
        _id: savedUser._id
      })
    })
  })
  
  // add exercises
  app.post('/api/exercise/add', (req, res, next) => {
    
    Users.findById(req.body.userId, (err, user) => {
      
      if(err) return next(err)
      
      if(!user) {
        return next({
          status: 400,
          message: 'unknow _id'
        })
      }
      
      const exercise = new Exercises(req.body)
      exercise.username = user.username
      exercise.save( (err, savedExercise) => {
        if(err) return next(err)
        savedExercise = savedExercise.toObject()
        delete savedExercise.__v
        savedExercise._id = savedExercise.userId
        delete savedExercise.userId
        savedExercise.date = (new Date(savedExercise.date)).toDateString()
        res.json(savedExercise)
      })    
    })  
  })

  const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('app running on port '+listener.address().port)
  })