import Person from "./Person"

const Persons = ({ persons, nameSearch, deletePerson }) => {
	const filteredPersons = (nameSearch === '') ? persons : persons.filter(person => person.name.toLowerCase().includes(nameSearch.toLowerCase()))

	return (
		<ul>
			{filteredPersons.map((person, index) =>
				<Person key={index} person={person} deletePerson={deletePerson} />
			)}
		</ul>
	)
}

export default Persons
