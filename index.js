const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json())

// console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yt4da.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("connection error", err);
  const gamesCollection = client.db("gamesplanet").collection("games");

  app.get('/games', (req, res) => {
    gamesCollection.find()
    .toArray((err, items) =>{
      res.send(items)
    })
  })

  app.post('/addGame', (req, res) => {
    const newGame = req.body
    console.log('adding new game: ', newGame);
    gamesCollection.insertOne(newGame)
    .then(result => {
      console.log('inserted', result.insertedCount);
      res.send('success', result.insertedCount > 0)
    })
  })

  // app.post('/manageGames', (req, res) => {
  //   const newGame = req.body
  //   console.log('adding new game: ', newGame);
  //   gamesCollection.insertOne(newGame)
  //   .then(result => {
  //     console.log('inserted', result.insertedCount);
  //     res.send('success', result.insertedCount > 0)
  //   })
  // })
  // client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})