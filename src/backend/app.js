const express = require('express')
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require('mongodb')
require("dotenv").config({ path: './.env'})


/* Connexion à MongoDB */
const uri = process.env.MONGO_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir)
mongoose.connect(process.env.MONGO_URI)



/* APP API */
const app = express()
const userRouter = require("./routes/user")
const bookRouter = require("./routes/book")
const path = require("path")
const helmet = require("helmet")

app.use(express.json())
app.use(helmet())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use("/images", express.static(path.join(__dirname, "images")))
app.use(`/api/auth`, userRouter)
app.use(`/api/books`, bookRouter)


module.exports = app
