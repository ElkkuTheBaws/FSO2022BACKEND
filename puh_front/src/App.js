import { useState } from 'react'
import {useEffect} from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import axios from "axios";
import personsServices from "./services/personsServices";
import Notification from "./components/Notification";
import './index.css'

const App = () => {

    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [isError, setIsError] = useState(false)

    const hook = () => {
        console.log('effect')
        personsServices
            .getAll()
            .then(initialPersons =>{
                console.log('promise fulfilled')
                setPersons(initialPersons)
            }).catch(error =>{
                setIsError(true)
                setNotificationMessage(error.response.data.error)
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 3000)
            })
    }

    useEffect(hook,[])

    const addPerson = (event) =>{
        event.preventDefault()

        const personObject ={
            name: newName,
            number: newNumber
        }

        const canAdd =  persons.filter(person => person.name === newName).length > 0 ? false : true

        console.log(canAdd)

        if(canAdd){
            personsServices
                .create(personObject)
                .then(returnedPerson =>{
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setIsError(false)
                    setNotificationMessage(
                        `Added ${returnedPerson.name}`
                    )
                    setTimeout(() => {
                        setNotificationMessage(null)
                    }, 3000)
                }).catch(error=>{
                    setIsError(true)
                    console.log(error.response.data.error)
                    setNotificationMessage(error.response.data.error)
                    setTimeout(() => {
                        setNotificationMessage(null)
                    }, 3000)
                })

        }else{

            if (window.confirm(`'${newName}' is already added to phonebook, replace the old number with new one?`)) {
                const person = persons.find(n => n.name === newName)
                personsServices
                    .update(person.id, personObject)
                    .then(updatedPerson => {
                        hook();
                    })
                    .catch(error =>{
                    setIsError(true)
                    setNotificationMessage(error.response.data.error)
                    setTimeout(() => {
                        setNotificationMessage(null)
                    }, 3000)
                    //setNotificationMessage(`Information of ${personObject.name} has already been removed from server`)
                    })
                setNewName('')
                setNewNumber('')
            }
        }

    }

    const handleNameChange = (event) =>{
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) =>{
      setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
      setNewFilter(event.target.value)
    }


    const filterNames = (list, filterName) => {
        return list.filter(per => per.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
    }


    const toggleDeleteOf = (list, id) =>{
        const url = `http://localhost:3001/persons/${id}`
        const person = list.find(n => n.id === id)
        //const deletePerson = {...person, important: !person.important}
        console.log(id)

        if (window.confirm(`Delete '${person.name}' ?`)) {
            personsServices
                .deletePerson(person.id)
                .then(() => {
                    hook();
                    setIsError(false)
                    setNotificationMessage(`${person.name} has been deleted`)
                })
                .catch(error =>{
                    setIsError(true)
                    setNotificationMessage(error.response.data.error)
                    setTimeout(() => {
                        setNotificationMessage(null)
                    }, 3000)
                    //setNotificationMessage(`The ${person.name} has already been removed from server`)
                })
        }
    }

  return (
      <div>
        <h2>Phonebook</h2>
          <Notification message={notificationMessage} isError={isError}/>
            <Filter val={newFilter}
                    onChange={handleFilterChange}
            />
          <h2>Add new</h2>
        <PersonForm onSubmit={addPerson}
                    nameValue={newName}
                    onChangeName={handleNameChange}
                    numberValue={newNumber}
                    onChangeNumber={handleNumberChange}
                    />

        <h2>Numbers</h2>

        <Persons list={persons} filter={newFilter} toggleDelete ={(id) => toggleDeleteOf(persons, id)}/>

      </div>
  )

}

export default App