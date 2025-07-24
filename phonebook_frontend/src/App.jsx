import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phoneService from './services/phonebook'
import Notification from './components/Notification'

const Header = ({ text }) => <h2>{text}</h2>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    phoneService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    // check if name exist
    const existingPerson = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmReplace) {
        const updatedPerson = { ...existingPerson, number: newNumber}

        phoneService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${returnedPerson.name}`)
            setMessageType('success')
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            setMessage(`Information of ${newName} has already been removed from server`)
            setMessageType('error')
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      
      phoneService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${returnedPerson.name}`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setMessageType('error')
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      console.log(`Attempting to delete ${name} with id ${id}`)
      phoneService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(`The person '${name}' was already removed from server`)
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div>
      <Header text="Phonebook" />
      <Notification message={message} type={messageType}/>
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />

      <Header text="Add a new" />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleInputChange={handleInputChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <Header text="Numbers" />
      <Persons personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}
export default App