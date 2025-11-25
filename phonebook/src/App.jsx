import { useState, useEffect } from 'react'
import Notification from './components/Notification.jsx'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personHelper from './services/person.js'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [nameSearch, setNameSearch] = useState('')
	const [addedMessage, setAddedMessage] = useState(null)
	const [messageType, setMessageType] = useState(null)

	useEffect(() => {
		personHelper
			.getAll()
			.then(initialPersons => {
				setPersons(initialPersons)
			})
	}, [])

	const addPerson = (event) => {
		event.preventDefault()
		const newPersonToBeAdded = { 'name': newName, 'number': newNumber }
		const personExists = isDuplicateName(persons, newName)
		if (!personExists) {
			personHelper
				.create(newPersonToBeAdded)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
					setNewName('')
					setNewNumber('')
					setMessageType('addedMessage')
					setAddedMessage(`Added ${newPersonToBeAdded.name}`)
					resetMessageType()
				})
		}
		else {
			if (window.confirm(`${personExists.name} is already added to the phonebook, replace the old number with a new one?`)) {
				updatePerson(personExists.id, newPersonToBeAdded)
			}
		}
	}

	const deletePerson = (id) => {
		return personHelper
			.deleteUser(id)
			.then(returnedPerson => {
				setPersons(persons.filter(n => n.id !== returnedPerson.id))
			})
			.catch(error => {
				console.log("id: ", id, " error: ", error)
			})
	}

	const updatePerson = (id, person) => {
		return personHelper
			.updateUser(id, person)
			.then(returnedPerson => {
				setPersons(persons.map(theperson => theperson.id === id ? returnedPerson : theperson))
				setNewName('')
				setNewNumber('')
				setMessageType('addedMessage')
				setAddedMessage(`Information about ${person.name} has been updated.`)
				resetMessageType()
			})
			.catch(error => {
				setMessageType('error')
				setAddedMessage(`Information about ${person.name} has already been removed from the server.`)
				setPersons(persons.filter(n => n.id !== id))
				resetMessageType()
			})
	}

	const resetMessageType = () => {
		setTimeout(() => {
			setMessageType(null)
			setAddedMessage(null)
		}, 5000);
	}

	const handlePersonChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleSearchChange = (event) => {
		setNameSearch(event.target.value)
	}

	const isDuplicateName = (persons, newName) => {
		console.log("persons: ", persons)
		console.log("newName: ", newName)
		return (persons.find(person => person.name === newName))
		console.log("found person: ", personFound)
	}


	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={addedMessage} type={messageType} />
			<Filter nameSearch={nameSearch} handleSearchChange={handleSearchChange} />
			<h3>Add new person</h3>
			<PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} />
			<h2>Numbers</h2>
			<Persons persons={persons} nameSearch={nameSearch} deletePerson={deletePerson} />
		</div>
	)
}

export default App
