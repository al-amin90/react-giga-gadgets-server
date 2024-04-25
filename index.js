const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()

// config && middlware
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
      
      const brandsCollections = client.db("gigaGadgetsDB").collection("brands")
      const productsCollections = client.db("gigaGadgetsDB").collection("products")
      
    app.get('/brands', async (req, res) => {
          const result = await brandsCollections.find().toArray()
          res.send(result)
    })
      
    app.get('/addProduct/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const result = await productsCollections.find(query).toArray()
        res.send(result)
    })

    app.get('/addProduct', async (req, res) => {
      const result = await productsCollections.find().toArray()
      res.send(result)
    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollections.findOne(query)
      res.send(result)
    })

    app.post('/brands', async(req, res) => {
      const newBrand = req.body;
      const result = await brandsCollections.insertOne(newBrand)
      res.send(result)
    })

    app.post('/addProduct', async (req, res) => {
        const newProduct = req.body;
        const result = await productsCollections.insertOne(newProduct)
        res.send(result)
    })

    app.put('/addProduct/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      console.log(product);

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          productName: product.name,
          brandName: product.brand,
          price: product.price,
          image: product.image,
          type: product.type,
          rating: product.rating,
        }
      }
      const result = await productsCollections.updateOne(filter, updateDoc, options)
      res.send(result)
    })
    
    app.delete('/addProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollections.deleteOne(query)
      res.send(result)

    })
      
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Giga gadgets server is running...")
})
app.listen(port, () => {
    console.log(`Giga server running port, ${port}`);
})