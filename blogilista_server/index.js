const http = require('http')
const app = require('./app')
//https://fullstackopen.com/osa4/sovelluksen_rakenne_ja_testauksen_alkeet#tehtavat-4-1-4-2

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})