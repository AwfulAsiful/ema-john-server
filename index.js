const express=require('express');
const { MongoClient } = require('mongodb'); 
const cors=require("cors"); 
const app=express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4kot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run(){
    try{
        await client.connect();
        const database=client.db('emaJohn');
        const productsCollection=database.collection('products');
        const ordersCollection=database.collection('orders')

        //GET API

        app.get('/products',async(req,res)=>{
            
            const cursor=productsCollection.find({});
            const page=req.query.page;
            const size=req.query.size;
            let products;
            const count =await cursor.count();

            if(page){
                products=await cursor.skip(page*size).limit(parseInt(size)).toArray();
            }
            else{
                products=await cursor.toArray();

            }
            res.send({
                count,
                products
            }) 
              
        });

        //POST API
        app.post('/products/keys',async(req,res)=>{
            const keys=req.body;
            const query={key:{$in:keys}}
            const products=productsCollection.find(query).toArray();
            res.json(products);
        });
        // POST API Orders
        app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result=ordersCollection.insertOne(order);
            res.json(result);
        })
    }
    finally
    {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running like a rabbit!!!');
})
app.listen(port,()=>{
    console.log("Listening to port",port);
})