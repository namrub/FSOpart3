const Person = ({ person, deletePerson }) => {
	return <li>{person.name} {person.number} <button onClick={() => { if (window.confirm(`Delete ${person.name}?`)) { deletePerson(person.id) } }}>delete</button></li>
}

export default Person
