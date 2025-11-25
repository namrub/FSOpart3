import axios from "axios";
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = newObject => {
	const request = axios.post(baseUrl, newObject)
	return request.then(response => response.data)
}

const deleteUser = idOfObject => {
	const request = axios.delete(`${baseUrl}/${idOfObject}`)
	return request.then(response => response.data)
}

const updateUser = (id, person) => {
	const request = axios.put(`${baseUrl}/${id}`, person)
	return request.then(response => response.data)
}

export default { getAll, create, deleteUser, updateUser }
