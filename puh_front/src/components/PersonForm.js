const PersonForm = ({onSubmit, nameValue, onChangeName, numberValue, onChangeNumber}) =>{
    return(
        <form onSubmit={onSubmit}>
            <div>
                name: <input
                value={nameValue}
                onChange={onChangeName}
            />
            </div>
            <div>number: <input
                value ={numberValue}
                onChange={onChangeNumber}
            />

            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm