const mongoose = require('mongoose')
require('dotenv').config()

const password = process.argv[2];
const nameInput = process.argv[3];
const numberInput = process.argv[4];
const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (nameInput && numberInput) {
  const contact = new Contact({
    name: nameInput,
    number: numberInput
  })

  contact.save().then(result => {
    console.log(`Added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error saving contact:', error)
    mongoose.connection.close()
  })
} else {
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name}  ${contact.number}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error fetching contacts:', error)
    mongoose.connection.close()
  })
}