const express = require("express");
const dotenv = require('dotenv');

const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const authRouter = require("./routers/auth");
const usersRoute = require("./routers/users");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", usersRoute);


MongoClient.connect(process.env.MONGO_URI_LOCALHOST+"bingame", function(err, db) {
  if (err) {
    console.error(err)
  }else{
    console.log("Database created!");
  }
  db.close();
});

MongoClient.connect(process.env.MONGO_URI_LOCALHOST, function(err, db) {
  if (err) throw err;
  let dbo = db.db("bingame");
  dbo.createCollection("users", function(err, res) {
    if (err) {
      console.log("Collection already exists.");
    }else{
      console.log("Collection created!");
    }
  });
  db.close();
});

app.listen(process.env.PORT || 5000, () =>
  console.log('listening on port:',process.env.PORT || 5000)
);
