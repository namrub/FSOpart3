const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4) {
	console.log('not enough arguments')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://frankburman_db_user:${password}@cluster0.ay8uuiw.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Phonebookentry = mongoose.model('Phonebookentry', phonebookSchema)

if (process.argv.length === 3) {
	Phonebookentry.find({}).then(result => {
		result.forEach(phonebookentry => {
			console.log(`${phonebookentry.name} ${phonebookentry.number}`)
		})
		mongoose.connection.close()
	})
} else {
	const phonebookentry = new Phonebookentry({
		name: `${process.argv[3]}`,
		number: `${process.argv[4]}`,
	})
	phonebookentry.save().then(result => {
		console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
		mongoose.connection.close()
	})
}


