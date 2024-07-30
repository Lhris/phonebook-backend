require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors());

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

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if (!body.name || !body.number){
      return response.status(400).json({
        error: "Name or Number is missing"
      })
    }
    
    else{
    let person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })}
  })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})