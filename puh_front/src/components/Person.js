const Person = ({person, toggleDelete}) =>{
    return(
        <li>
            {person.name}
            {person.number}
            <button onClick={() => toggleDelete(person.id)}>{'delete'}</button>
        </li>
    )
}

export default Person