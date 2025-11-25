const Filter = ({ nameSearch, handleSearchChange }) => {
	return (
		<div> filter shown with <input value={nameSearch} onChange={handleSearchChange} /> </div>
	)
}

export default Filter
