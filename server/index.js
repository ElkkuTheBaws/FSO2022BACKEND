require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

morgan.token('body', function getBody(req){
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
  res.send('Main page of the express server')
})

app.get('/api/persons', (req,res,next) => {
  Person.find({}).then(person => {
    res.json(person)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (req,res, next) => {
  const id = String(req.params.id)
  Person.findById(id).then(person => {
    if(person){
      res.json(person)
    }else{
      res.status(404).end()
    }
  }).catch(error => next(error))
})



app.delete('/api/persons/:id', (req,res, next) => {
  const id = String(req.params.id)
  Person.findByIdAndRemove(id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (req,res, next) => {
  const body = req.body
  Person.find({}).then(persons => {
    if(persons.find(person => person.name === body.name)){
      return res.status(400).json({
        error: 'Name is already in the list'
      })
    }
  })

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedNote => {
    res.json(savedNote)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req,res, next) => {
  const id = String(req.params.id)
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res,next) => {
  Person.find({}).then(persons => {
    res.send(`
    <h>
    <p>Phonebook has info of ${persons.length}</p>
    <p>${new Date()}</p>
    </h>`)
  }).catch(error => next(error))

})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if(error.name === 'TypeError') {
    return response.status(400).send({ error: 'type error' })
  }
  if(error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)