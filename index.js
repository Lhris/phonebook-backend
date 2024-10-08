require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())

const Person = require('./models/person')

morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''  
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(express.json())
app.use(express.static('dist'))


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  })
    .catch(error =>next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).
    then(person => {
      if (person){response.json(person)} else {response.status(404).end()}}).catch(error => next(error))}
)

app.post('/api/persons', (request, response, next) => {
  const body = request.body
    
  if (!body.name || !body.number){
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  }
    
  else{
    let person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error =>
      next(error)
    )}
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(
    request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'}).then(updatedPerson => {
    response.json(updatedPerson)
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})