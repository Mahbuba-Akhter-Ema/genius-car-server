const express = require ('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Genius car server is running')
})

app.listen(port, () => {
    console.log(`Genius car is Listening ${port}`);
})

// username: genius_car
// password : CAAI1ScSVx1bYQ0n

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.trknobu.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
        try{
            const serviceCollection = client.db('geniuscar').collection('services');
            const orderCollection = client.db('geniuscar').collection('orders');

            app.get('/services', async(req, res) => {
                const query = {};
                const cursor = serviceCollection.find(query);
                const services = await cursor.toArray();
                res.send(services);
            })

            // to get single id :
            app.get('/services/:id', async (req, res) => {
                const id = req.params.id;
                // call objectId from mongodb 
                const query = {_id: new ObjectId(id)};
                const service = await serviceCollection.findOne(query);
                res.send(service);
            })

            // orders api 

            // order collections from client side 
            app.get('/orders', async(req, res) => {
                // console.log(req.query.email);
                let query = {};
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            });

            // you have to use  post method to create data 
            app.post('/orders', async(req, res) => {
                const order = req.body;
                const result = await orderCollection.insertOne(order);
                res.send(result);
            });

            app.patch('/orders/:id', async (req, res) => {
                const id = req.params.id;
                const status = req.body.status
                const query = { _id: new ObjectId(id) }
                const updatedDoc = {
                    $set:{
                        status: status
                    }
                }
                const result = await orderCollection.updateOne(query, updatedDoc);
                res.send(result);
            })

            app.delete('/orders/:id', async(req, res) => {
                const id = req.params.id;
                const query = {_id: new ObjectId(id)};
                const result = await orderCollection.deleteOne(query);
                res.send(result);
            })
        }
        finally{

        }
}
run ().catch(error=>{console.log(error)})

