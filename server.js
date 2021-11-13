require('dotenv').config()

const {PORT=3000, DATABASE_URL} = process.env

const express = require('express')

const app = express()

const mongoose = require('mongoose')

const cors = require('cors')

const morgan = require('morgan')


///////////////////////////////
// DATABASE CONNECTION
///////////////////////////////

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
    .on('open', () => console.log('Connected to mongoose'))
    .on('close', () => console.log('Disconnected from mongoose'))
    .on('error', (error) => console.log(error))


///////////////////////////////
// Models
///////////////////////////////

const CheeseSchema = new mongoose.Schema({
    name: String,
    country: String,
    image: String
})

const Cheese = mongoose.model('Cheese', CheeseSchema)


///////////////////////////////
// Middleware
///////////////////////////////

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


///////////////////////////////
// Routes
///////////////////////////////

// Home route
app.get('/', (req,res) => {
    res.send('<h1>Cheese API</h1>')
})

// Index Route
app.get('/cheese', async (req,res) =>{
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Create Route
app.post('/cheese', async (req,res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch {
        res.status(400).json(error)
    }
})

// Update Route
app.put('/cheese/:id', async (req,res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete Route
app.delete('/cheese/:id', async (req,res) => {
    try {
        res.json(await Cheese.findByIdAndDelete(id))
    } catch (error) {
        res.status(400).json(error)
    }
})



///////////////////////////////
// Listener
///////////////////////////////

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))