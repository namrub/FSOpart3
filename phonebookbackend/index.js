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

app.get('/api/persons/:id', (request, response, next) => {
	Phonebookentry.findById(request.params.id).then((phonebookentry) => {
		if (phonebookentry) {
			response.json(phonebookentry)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Phonebookentry.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({ error: 'content missing' })
	}

	const phonebookentryExists = Phonebookentry.findOne({ name: body.name }).then(phonebookentryExists => {
		if (phonebookentryExists) {
			//put
			phonebookentryExists.number = body.number
			return phonebookentryExists.save().then(phonebookentryUpdated => {
				response.json(phonebookentryUpdated)
			})
				.catch(error => next(error))
		} else {
			//post
			const phonebookentry = new Phonebookentry({
				name: body.name,
				number: body.number
			})
			return phonebookentry.save().then(savedPhonebookentry => {
				response.json(savedPhonebookentry)
			})
				.catch(error => next(error))
		}
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Phonebookentry.findById(request.params.id)
		.then(phonebookentry => {
			if (!phonebookentry) {
				return response.status(404).end()
			}

			phonebookentry.name = name
			phonebookentry.number = number

			return phonebookentry.save().then((updatedPhonebookentry) => {
				response.json(updatedPhonebookentry)
			})
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
