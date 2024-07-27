const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log("url initialized")

// mongoose.set('strictQuery',false)

mongoose.connect(url).then(result => {
  console.log('MongoDB Connected - Person.js')
}).catch((error) => {
  console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

module.exports = mongoose.model('Person', personSchema)
