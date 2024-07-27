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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()  
})

app.post('/api/persons', async (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    try {
        const existingPerson = await Person.findOne({ name: body.name })
        if (existingPerson) {
            return response.status(409).json({ 
                error: 'name must be unique' 
            })
        }
  
        const person = new Person({
            name: body.name,
            number: body.number
        })

        const savedPerson = await person.save()
        response.json(savedPerson)
    } catch (error) {
        next(error)
    }
})
// app.get('/api/info', (request, response) => {
//     const currentDate = new Date()
//     response.send(`</p> phonebook has information for ${peopleCount} people</p> <p>${currentDate}</p>`)
//  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})