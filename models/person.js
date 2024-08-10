const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log('url initialized')

// mongoose.set('strictQuery',false)

mongoose.connect(url).then(() => {
  console.log('MongoDB Connected - Person.js')
}).catch((error) => {
  console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const phoneNumberRegex = /^\d{2,3}-\d+$/
        return phoneNumberRegex.test(value)
      },
      message: props => `${props.value} is not a valid phone number format. Phone number must be in the format xx-xxxxxxx or xxx-xxxxxxx.`
    }
  }})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
