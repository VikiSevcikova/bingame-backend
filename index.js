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

MongoClient.connect(process.env.MONGO_URI+"bingame", function(err, db) {
  if (err) console.log("Database already exists.")
  console.log("Database was created!");
  dbo.createCollection("users", function(err, res) {
    if (err) console.log("Collection already exists.");
    console.log("Collection was created!");
    db.close();
  });
  db.close();
});

app.listen(process.env.PORT || 5000, () =>
  console.log('listening on port:',process.env.PORT || 5000)
);
