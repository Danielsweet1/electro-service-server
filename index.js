const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8d3cohe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const serviceCollection = client.db('electroService').collection('services')

async function run (){
    try{
        app.get('/home/services',async (req,res)=>{
            const query = {}
            const result = await serviceCollection.find(query).limit(3).toArray()
            res.send(result)
        })
        app.get('/services',async (req,res)=>{
            const query = {}
            const result = await serviceCollection.find(query).toArray()
            res.send(result)
        })
    }
    catch{

    }
}
run().catch(e=>console.log(e))

app.listen(port, () => {
  console.log("server is running on port", port);
});
