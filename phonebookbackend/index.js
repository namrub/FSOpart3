require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Phonebookentry = require('./models/phonebookentry.js')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

morgan.token('body', request => {
	return JSON.stringify(request.body)
})

let persons = []

// const generateId = () => {
// 	return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
// }

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
	const currentTime = new Date
	const phonebookEntries = persons.length
	response.send(`<p>Phonebook has info for ${phonebookEntries} people</p> <p>${currentTime.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
	Phonebookentry.find({}).then((phonebookentry) => {
		response.json(phonebookentry)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Phonebookentry.findById(request.params.id).then((phonebookentry) => {
		response.json(phonebookentry)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	phonebookentrys = phonebookentrys.filter((phonebookentry) => phonebookentry.id !== id)

	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({ error: 'content missing' })
	}

	const phonebookentry = new Phonebookentry({
		name: body.name,
		number: body.number
	})

	phonebookentry.save().then(savedPhonebookentry => {
		response.json(savedPhonebookentry)
	})
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
