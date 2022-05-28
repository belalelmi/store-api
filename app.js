require('dotenv').config()

const express = require('express')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>welcome home</h1><a href="/api/v1/products">products</a>')
})

//products routes

app.use(errorHandlerMiddleware)
app.use(notFound)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    //connectDB
    app.listen(
      PORT,
      console.log(`Server initiated in dev mode on PORT ${PORT}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
