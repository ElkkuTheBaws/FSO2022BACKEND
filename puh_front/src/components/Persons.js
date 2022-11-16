import Person from "./Person";

const filterNames = (list, filterName) => {
    return list.filter(per => per.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
}



const Persons = ({list, filter, toggleDelete}) =>{


    return(
        filterNames(list, filter).map((person) =>
            <Person
                key ={person.id}
                person={person}

                toggleDelete= {toggleDelete}
            />
        )
    )

}

export default Persons