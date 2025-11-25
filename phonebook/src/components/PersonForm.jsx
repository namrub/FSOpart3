const PersonForm = ({ addPerson, newName, newNumber, handlePersonChange, handleNumberChange }) => {
	return (
		<form onSubmit={addPerson}>
			<div>name: <input value={newName} onChange={handlePersonChange} /> </div>
			<div>number: <input value={newNumber} onChange={handleNumberChange} /> </div>
			<button type="submit">add</button>
		</form>
	)
}

export default PersonForm
