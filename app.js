require('dotenv').config()
require('express-async-errors')

const express = require('express')
const morgan = require('morgan')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

const app = express()
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

app.use(express.json())
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.send('<h1>welcome home</h1><a href="/api/v1/products">products</a>')
})

app.use('/api/v1/products', productsRouter)

//products routes

app.use(errorHandlerMiddleware)
app.use(notFound)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(
      PORT,
      console.log(`Server initiated in dev mode on PORT ${PORT}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
