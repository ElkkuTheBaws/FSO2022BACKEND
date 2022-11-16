const Filter = ({val, onChange}) =>{
    return(
        <div>filter shown with: <input
            value = {val}
            onChange= {onChange}
        />
        </div>
        )
}

export default Filter