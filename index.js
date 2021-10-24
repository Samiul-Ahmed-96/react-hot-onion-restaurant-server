const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iy3km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database = client.db('HotOnion');
        const foodCollection = database.collection('foods');

        //Get api
        app.get('/items',async(req,res)=>{
            const cursor = foodCollection.find({})
            const items  = await cursor.toArray();
            res.send(items);
        })
        //Get single item
        app.get('/items/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const item = await foodCollection.findOne(query);
            res.json(item);
        })
        //Post Api
        app.post('/items',async(req,res)=>{
            const food = req.body;
            console.log(food);
            console.log('hit the api')
            
            const result = await foodCollection.insertOne(food);
            console.log(result);
            res.send(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req,res)=>{
    res.send('Server running');
})

app.listen(port , ()=>{
    console.log('Running server',port);
})