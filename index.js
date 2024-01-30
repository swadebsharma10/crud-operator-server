const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const userCollection = client.db('CrudDB').collection('users');

    app.post('/users', async(req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/users', async(req, res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result)
    })

     // update a user
     app.patch('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const filter ={_id: new ObjectId(id)}
        const user = req.body;
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: user.name,
              address: user.address,
              email: user.email
            },
          };
         const result = await userCollection.updateOne(filter, updateDoc, options);  
         res.send(result)

    })

    app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })

   

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('crud operation is running')
})

app.listen(port, () => {
  console.log(`Crud operation is running on port ${port}`)
})