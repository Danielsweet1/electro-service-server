const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

const serviceCollection = client.db("electroService").collection("services");
const reviewCollection = client.db("electroService").collection("reviews");

async function run() {
  try {
    //services
    app.get("/home/services", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).limit(3).toArray();
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const query = {
        serviceName: service.serviceName,
        img: service.photo,
        price: service.price,
        rating: service.rating,
        description: service.description,
      };
      const result = await serviceCollection.insertOne(query);
      res.send(result);
    });

    //Reviews

    //get reviews by id
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { serviceId: id };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    //get reviews by email
    app.get("/reviews", async (req, res) => {
      const userEmail = req.query.email
      let query = {}
      if(userEmail){
        query= {
          email: userEmail
        }
      }
      const result = await reviewCollection.find(query).toArray()
      res.send(result)
      
    });
    //post review
    app.post("/reviews", async (req, res) => {
      const { userName, userImage, review, serviceId, email, serviceName } = req.body;
      const query = {
        userName,
        userImage,
        review,
        serviceId,
        email,
        serviceName
      };
      const result = await reviewCollection.insertOne(query);
      res.send(result);
    });

    //delete review
    app.delete('/reviews/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}

      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })

  } finally {
  }
}
run().catch((e) => console.log(e));

app.listen(port, () => {
  console.log("server is running on port", port);
});
