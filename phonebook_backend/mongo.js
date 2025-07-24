const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
  console.log('give password as argument')
  process.exit(1)
}

const url = `mongodb+srv://vulyccschool:${password}@cluster0.gnfnbkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.error('Error during fetching: ', err)
      mongoose.connection.close()
    })
}

else if (process.argv.length === 5) {
  const person = new Person({ name, number })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.error('Error during saving: ', err)
      mongoose.connection.close()
    })
}

else {
  console.log('Usage:')
  console.log('  To list: node mongo.js <password>')
  console.log('  To add:  node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}