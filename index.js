const express = require("express");
const dotenv = require('dotenv');

const cors = require("cors");

const authRouter = require("./routers/auth");
const usersRoute = require("./routers/users");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", usersRoute);

app.get("/", (req, res, next) => {
  res.send({ name: "Viki" });
});

app.listen(process.env.PORT || 5000, () =>
  console.log('listening on port:',process.env.PORT || 5000)
);
