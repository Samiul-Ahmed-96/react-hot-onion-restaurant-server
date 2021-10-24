const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iy3km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database = client.db('HotOnion');
        const foodCollection = database.collection('foods');

        //Post Api
        app.post('/foods',async(req,res)=>{
            const food = {
                name : 'Rice',
                des : 'Food',
                price: 110,
                rating : 4.2
                
            };
            const result = await foodCollection.insertOne(food);
            console.log(result);
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