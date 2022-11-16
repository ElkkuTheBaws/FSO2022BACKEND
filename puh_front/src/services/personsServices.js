import axios from "axios";
const baseUrl = 'https://fso-backend.fly.dev/api/persons'
//const baseUrl = 'http://localhost:8080/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const deletePerson = (id) =>{
   return axios.delete(`${baseUrl}/${id}`)
        .then(() =>
            console.log("DELETED")
        )
}

export default {getAll, create, update, deletePerson}