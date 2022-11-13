const morgan = require('morgan')
const express = require('express')

const app = express()


morgan.token('body', function getBody(req){
    if(req.method === 'POST'){
        return JSON.stringify(req.body) 
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-5214321"
    },
    {
        id: 2,
        name: "Ade Lovelance",
        number: "521-555555"
    },
    {
        id: 3,
        name: "Dan Ambramov",
        number: "666-654432"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "123-456789"
    }
]

app.get('/', (req, res) => {
    res.send('Main page of the express server')
})

app.get('/api/persons', (req,res)=>{
    res.json(persons);
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person);
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req,res) =>{
    const body = req.body    
    if(!body.name){
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error: 'number is missing'
        })
    }

   if(persons.find(person => person.name === body.name)){
    return res.status(400).json({
        error: 'Name is already in the list'
    })
   }

    const person = {
        id: generateRandomId(100000), 
        name: body.name,
        number: body.number,
    } 

    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) =>{
    res.send(`
    <h>
    <p>Phonebook has info for ${persons.length}</p>
    <p>${new Date()}</p>
    </h>`)
})

const PORT = 3001;
app.listen(PORT, () =>{
    console.log('server is running on port: ',PORT )
});


const generateRandomId = (max) =>{
    return Math.floor(Math.random() * max);
}