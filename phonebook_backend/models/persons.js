const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true,
  },
  number: {
    type: String,
    validate: [
      {
        validator: function(v) {
          return v && v.length >= 8
        },
        message: props => `${props.value} is shorter than the minimum length of 8`
      },
      {
        validator: function(v) {
          // Custom validator: two or three digits, a hyphen, then digits
          // Regex explanation:
          // ^ start of string
          // \d{2,3} : exactly 2 or 3 digits
          // - : a hyphen
          // \d+ : one or more digits
          // $ end of string
          return /^\d{2,3}-\d+$/.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    ],
    require: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
