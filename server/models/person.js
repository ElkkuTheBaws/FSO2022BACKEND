
const mongoose = require('mongoose')

const url = 'mongodb+srv://testi:koreatesti@cluster0.skcd3bz.mongodb.net/?retryWrites=true&w=majority'
//const url = process.env.MONGOURI

mongoose.connect(url).then(result => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB: ', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    requred: [true, 'Person name is required']
  },
  number:{
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,8}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Person phone number is required']
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)